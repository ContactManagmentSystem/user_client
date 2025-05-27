import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Alert,
  message,
  Modal,
  Form,
  Select as AntSelect,
  Input,
} from "antd";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // For default styling
import {
  useGetPackage,
  useDeletePackage,
  useEditPackage,
  useCreatePackage,
  useGetProduct, // Hook to fetch existing products
} from "../../../api/hooks/useProdPkg";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../Dashboard/components/Customers";
import { IconDots } from "@tabler/icons-react";
import Loading from "../../ui/Loading";

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
];

const PackageTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingPackage, setEditingPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("edit"); // "edit" or "add"
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState([]);

  const { data, isLoading, error, isError } = useGetPackage(
    currentPage,
    pageSize
  );
  const { data: productData, isLoading: isLoadingProducts } = useGetProduct();
  const deletePackage = useDeletePackage();
  const editPackage = useEditPackage();
  const addPackage = useCreatePackage();

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    if (productData) {
      setProductOptions(
        productData?.data.products?.map((product) => ({
          label: product.name,
          value: product._id,
        }))
      );
    }
  }, [productData]);

  const handleDelete = useCallback(
    (packageId) => {
      deletePackage.mutate(packageId, {
        onSuccess: () => {
          message.success("Package deleted successfully");
        },
        onError: (err) => {
          message.error(`Error: ${err.message}`);
        },
      });
    },
    [deletePackage]
  );

  const handleEdit = useCallback(
    (pkg) => {
      setEditingPackage(pkg);
      setModalType("edit");
      // console.log("Editing package:", pkg);
      form.setFieldsValue({
        name: pkg.name,
        include: pkg?.include?.map((item) => item._id),
        price: pkg.price,
      });
      // console.log(form)
      setModalVisible(true);
    },
    [form]
  );

  const handleAdd = () => {
    setEditingPackage(null);
    setModalType("add");
    form.resetFields();
    setModalVisible(true);
  };

  const handleSave = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const includeIds = values.include || [];

        if (modalType === "edit" && editingPackage) {
          editPackage.mutate(
            {
              packageId: editingPackage._id,
              packageData: {
                ...values,
                include: includeIds,
              },
            },
            {
              onSuccess: () => {
                message.success("Package updated successfully");
                setModalVisible(false);
                setEditingPackage(null);
              },
              onError: (err) => {
                message.error(`Error: ${err.message}`);
              },
            }
          );
        } else if (modalType === "add") {
          addPackage.mutate(
            {
              ...values,
              include: includeIds,
            },
            {
              onSuccess: () => {
                message.success("Package added successfully");
                setModalVisible(false);
              },
              onError: (err) => {
                message.error(`Error: ${err.message}`);
              },
            }
          );
        }
      })
      .catch((info) => {
        message.error("Validation Failed:", info);
      });
  }, [editingPackage, form, editPackage, modalType, addPackage]);

  const renderActionsMenu = (pkg) => (
    <div className="p-2">
      <div
        className="p-2 text-blue-700 cursor-pointer hover:bg-blue-700 hover:text-white rounded transition duration-150 px-5"
        onClick={() => handleEdit(pkg)}
      >
        Edit
      </div>
      <div
        className="p-2 text-red-700 cursor-pointer hover:bg-red-700 hover:text-white rounded transition duration-150 px-5"
        onClick={() => handleDelete(pkg._id)}
      >
        Delete
      </div>
    </div>
  );

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Include",
      key: "include",
      render: (text, record) => (
        <div>
          {record.include.map((item, idx) => (
            <div key={idx}>
              <span>{item.name}</span>: <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div className="text-green-700">${price.toFixed(2)}</div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tippy
          className="bg-white border shadow"
          content={renderActionsMenu(record)}
          arrow={false}
          placement="bottom"
          trigger="mouseenter"
          interactive
        >
          <Button>
            <IconDots />
          </Button>
        </Tippy>
      ),
    },
  ];

  if (isLoading || isLoadingProducts) return (
    <div className="w-full h-[50vh]">
      <Loading />
    </div>
  );
  if (isError)
    return (
      <Alert
        message={`Error: ${error?.message || "Something went wrong"}`}
        type="error"
      />
    );

  const packages = data?.data.packages || [];
  const totalPages = data?.data.table.totalPages;

  return (
    <div>
      <div className="pagination-controls flex justify-between mb-5 items-center">
        <AntSelect
          value={pageSize}
          onChange={(value) => setPageSize(value)}
          options={pageSizeOptions}
          style={{ width: 120 }}
        />
        <div
          className="bg-blue-700 hover:bg-blue-600 flex justify-center items-center text-white rounded py-2 px-5 cursor-pointer"
          onClick={handleAdd}
        >
          Add Product
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={packages}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
        loa
      />
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        containerClassName="pagination"
        activeClassName="active"
        disabledClassName="disabled"
        forcePage={currentPage - 1}
      />
      <Modal
        title={modalType === "edit" ? "Edit Package" : "Add Package"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText={modalType === "edit" ? "Save" : "Add"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the package name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="include"
            label="Include"
            rules={[
              {
                required: true,
                message: "Please select the items to include!",
              },
            ]}
          >
            <AntSelect
              mode="multiple"
              options={productOptions}
              placeholder="Select products"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageTable;
