/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select as AntSelect,
  Upload,
  message,
  Tooltip,
  Divider,
  Typography,
  Alert,
} from "antd";
import { CopyOutlined, PlusOutlined } from "@ant-design/icons";
import { useCreateOrder, useGetPaymentType } from "../../../api/hooks/useQuery";
import { useManageStore } from "../../../store/useManageStore";
import OrderDetail from "./OrderDetail";

const { Option } = AntSelect;
const { Title } = Typography;

const ConfirmModal = ({ message: note, onClose, acceptPaymentTypes = [] }) => {
  const [form] = Form.useForm();
  const createOrder = useCreateOrder();
  const { data: payments = [] } = useGetPaymentType();

  const { generatePlaceOrder, clearCart, resetPlaceOrder, addOrderHistory } =
    useManageStore();

  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const fileRef = useRef(null);

  const handleUploadChange = ({ fileList }) => {
    const latest = fileList.slice(-1).map((file) => {
      if (!file.url && !file.preview) {
        file.preview = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setFileList(latest);
    fileRef.current = latest[0]?.originFileObj || null;
  };

  const handleRemove = () => {
    setFileList([]);
    fileRef.current = null;
  };

  const onFinish = async (values) => {
    const {
      phonePrimary,
      phoneSecondary,
      address,
      paymentType,
      paymentDetails,
    } = values;

    const selected = payments.data?.find((p) => p._id === paymentDetails);

    if (paymentType === "Prepaid") {
      if (!selected) {
        message.error("Please select a payment method.");
        return;
      }
      if (!fileRef.current) {
        message.error("Please upload a transaction screenshot.");
        return;
      }
    }

    const siteOwnerId = import.meta.env.VITE_OWNER;
    if (!siteOwnerId) {
      message.error("Missing site owner ID. Please contact support.");
      return;
    }

    generatePlaceOrder(
      phonePrimary,
      address,
      paymentType,
      paymentType === "Prepaid"
        ? {
            paymentPlatform: selected.platform,
            paymentPlatformUserName: selected.platformUserName,
            accountId: selected._id,
          }
        : {},
      phoneSecondary
    );

    try {
      const formData = new FormData();
      const payload = useManageStore.getState().placeOrder;

      payload.products.forEach((p, i) => {
        formData.append(`products[${i}][productId]`, p.productId);
        formData.append(`products[${i}][quantity]`, p.quantity);
      });
      formData.append("phonePrimary", payload.phonePrimary);
      formData.append("phoneSecondary", payload.phoneSecondary);
      formData.append("address", payload.address);
      formData.append("paymentType", payload.paymentType);
      formData.append("siteOwner", siteOwnerId);

      if (payload.paymentType === "Prepaid") {
        formData.append(
          "paymentDetails[paymentPlatform]",
          payload.paymentDetails.paymentPlatform
        );
        formData.append(
          "paymentDetails[paymentPlatformUserName]",
          payload.paymentDetails.paymentPlatformUserName
        );
        formData.append(
          "paymentDetails[accountId]",
          payload.paymentDetails.accountId
        );
        formData.append("transactionScreenshot", fileRef.current);
      }

      setSubmitting(true);

      const config = {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          message.open({
            key: "order-upload",
            type: "loading",
            content: `Your file size is too large please wait... ${percent}%`,
            duration: 0,
          });
        },
      };

      const response = await createOrder.mutateAsync({
        data: formData,
        config,
      });
      const orderId = response?.data?._id;

      if (orderId) {
        addOrderHistory(orderId);
      }

      message.destroy("order-upload");
      message.success("Order placed successfully.");
      clearCart();
      resetPlaceOrder();
      onClose(orderId);
    } catch (err) {
      console.error(err);
      message.destroy("order-upload");
      message.error("Order failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const watchedPaymentId = Form.useWatch("paymentDetails", form);
  const selected = payments.data?.find((p) => p._id === watchedPaymentId);

  const showCOD = acceptPaymentTypes.includes("COD");
  const showPrepaid = acceptPaymentTypes.includes("Prepaid");

  return (
    <div className="fixed -top-10 left-0 right-0 bottom-0 z-50 backdrop-blur-md bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b">
          <Title level={4} className="m-0">
            Confirm Order
          </Title>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-6">
          <OrderDetail note={note} />
          <Divider />
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              paymentType: showCOD ? "COD" : showPrepaid ? "Prepaid" : "",
            }}
          >
            <Form.Item
              label="Primary Phone"
              name="phonePrimary"
              rules={[{ required: true, message: "Primary phone is required" }]}
            >
              <Input placeholder="09xxxxxxx" />
            </Form.Item>

            <Form.Item label="Secondary Phone" name="phoneSecondary">
              <Input placeholder="Optional" />
            </Form.Item>

            <Form.Item
              label="Delivery Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input.TextArea placeholder="Enter your address" rows={2} />
            </Form.Item>

            {showCOD || showPrepaid ? (
              <Form.Item
                label="Payment Type"
                name="paymentType"
                rules={[{ required: true, message: "Select a payment type" }]}
              >
                <Radio.Group>
                  {showCOD && <Radio value="COD">Cash on Delivery</Radio>}
                  {showPrepaid && <Radio value="Prepaid">Prepaid</Radio>}
                </Radio.Group>
              </Form.Item>
            ) : (
              <Alert
                message="This shop is not accepting any payment types currently."
                type="warning"
                showIcon
              />
            )}

            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) =>
                getFieldValue("paymentType") === "Prepaid" &&
                showPrepaid && (
                  <>
                    <Form.Item
                      label="Select Platform"
                      name="paymentDetails"
                      rules={[{ required: true, message: "Select a platform" }]}
                    >
                      <AntSelect placeholder="Choose a platform" allowClear>
                        {payments.data?.map((p) => (
                          <Option key={p._id} value={p._id}>
                            {p.platform}
                          </Option>
                        ))}
                      </AntSelect>
                    </Form.Item>

                    {selected && (
                      <div className="rounded-md border p-3 bg-gray-50 space-y-3">
                        <Form.Item label={<strong>Platform Username</strong>}>
                          <Input
                            disabled
                            value={selected.platformUserName}
                            addonAfter={
                              <Tooltip title="Copy Username">
                                <CopyOutlined
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      selected.platformUserName
                                    );
                                    message.success("Username copied");
                                  }}
                                  className="cursor-pointer"
                                />
                              </Tooltip>
                            }
                          />
                        </Form.Item>

                        <Form.Item label={<strong>Account Number</strong>}>
                          <Input
                            disabled
                            value={selected.accountNumber}
                            addonAfter={
                              <Tooltip title="Copy Account Number">
                                <CopyOutlined
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      selected.accountNumber
                                    );
                                    message.success("Account number copied");
                                  }}
                                  className="cursor-pointer"
                                />
                              </Tooltip>
                            }
                          />
                        </Form.Item>
                      </div>
                    )}

                    <Form.Item label="Transaction Screenshot">
                      <Upload
                        fileList={fileList}
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                        onRemove={handleRemove}
                        accept="image/*"
                        showUploadList={{
                          showPreviewIcon: false,
                          showRemoveIcon: true,
                        }}
                      >
                        {fileList.length < 1 && (
                          <div className="flex flex-col items-center text-gray-500 border-dashed border rounded p-2 border-gray-600 cursor-pointer">
                            <PlusOutlined style={{ fontSize: 22 }} />
                            <span className="mt-1 text-sm font-medium">
                              Upload Image
                            </span>
                            <span className="text-xs text-gray-400">
                              JPG/PNG
                            </span>
                          </div>
                        )}
                      </Upload>

                      {fileList.length > 0 && (
                        <div className="relative flex flex-col items-center mt-4">
                          <img
                            src={fileList[0].preview}
                            alt="Screenshot Preview"
                            className="rounded-xl border border-gray-200 shadow-md"
                            style={{
                              maxHeight: 220,
                              maxWidth: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <span className="text-xs text-gray-500 mt-2 italic">
                            {fileList[0].name}
                          </span>
                          <Button
                            type="text"
                            size="small"
                            danger
                            className="absolute top-2 right-2 bg-white/80 rounded-full"
                            onClick={handleRemove}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
          </Form>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <Button onClick={() => onClose()} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={submitting}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
