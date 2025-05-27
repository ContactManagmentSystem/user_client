import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Alert,
  message,
  Select as AntSelect,
  Modal,
  Form,
  Input,
} from "antd";
import { IconDots } from "@tabler/icons-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
  useGetProduct,
  useDeleteProduct,
  useEditProduct,
  useCreateProduct,
} from "../../../api/hooks/useProdPkg";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../Dashboard/components/Customers";
import Loading from "../../ui/Loading";

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
];

const ProductTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("edit"); // "edit" or "add"
  const [form] = Form.useForm();

  const { data, isLoading, error, isError } = useGetProduct(
    currentPage,
    pageSize
  );
  const deleteProduct = useDeleteProduct();
  const editProduct = useEditProduct();
  const addProduct = useCreateProduct();

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const handleDelete = useCallback(
    (productId) => {
      deleteProduct.mutate(productId, {
        onSuccess: () => {
          message.success("Product deleted successfully");
        },
        onError: (err) => {
          message.error(`Error: ${err.message}`);
        },
      });
    },
    [deleteProduct]
  );

  const handleEdit = useCallback(
    (product) => {
      setEditingProduct(product);
      setModalType("edit");
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
      });
      setModalVisible(true);
    },
    [form]
  );

  const handleAdd = () => {
    setEditingProduct(null);
    setModalType("add");
    form.resetFields();
    setModalVisible(true);
  };

  const handleSave = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (modalType === "edit" && editingProduct) {
          editProduct.mutate(
            {
              productId: editingProduct._id,
              productData: values,
            },
            {
              onSuccess: () => {
                message.success("Product updated successfully");
                setModalVisible(false);
                setEditingProduct(null);
              },
              onError: (err) => {
                message.error(`Error: ${err.message}`);
              },
            }
          );
        } else if (modalType === "add") {
          addProduct.mutate(values, {
            onSuccess: () => {
              message.success("Product added successfully");
              setModalVisible(false);
            },
            onError: (err) => {
              message.error(`Error: ${err.message}`);
            },
          });
        }
      })
      .catch((info) => {
        message.error("Validation Failed:", info);
      });
  }, [editingProduct, form, editProduct, modalType, addProduct]);

  const renderActionsMenu = (product) => (
    <div className="p-2">
      <div
        className="p-2 text-blue-700 cursor-pointer hover:bg-blue-700 hover:text-white rounded transition duration-150 px-5"
        onClick={() => handleEdit(product)}
      >
        Edit
      </div>
      <div
        className="p-2 text-red-700 cursor-pointer hover:bg-red-700 hover:text-white rounded transition duration-150 px-5"
        onClick={() => handleDelete(product._id)}
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
    { title: "Description", dataIndex: "description", key: "description" },
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

  if (isLoading)
    return (
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

  const products = data?.data.products || [];
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
        dataSource={products}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
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
        title={modalType === "edit" ? "Edit Product" : "Add Product"}
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
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
