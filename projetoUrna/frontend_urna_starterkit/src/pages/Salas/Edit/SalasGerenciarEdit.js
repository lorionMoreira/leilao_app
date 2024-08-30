import React, {  useState,useMemo, useEffect  } from "react";
import {
  Container,
  Col,
  Row,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Label,
  Modal,
  FormFeedback,
  CardImg,
  Card,
  CardTitle
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
//Import Breadcrumb
import { del, get, post, put,setAuthToken  } from "../../../helpers/api_helper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from '../../../components/Common/TableContainerNoFilterEdit';
import Pagination from '../../../components/Common/Pagination';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/actions";
//i18n
import { withTranslation } from "react-i18next";
const SalasGerenciarEdit = props => {

  const { uuid } = useParams();
  const history = useNavigate();
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sala, setSala] = useState(null);

  const [productData, setProductData] = useState(null);
  const [productDataArray, setProductDataArray] = useState(null);

  const [isEdit, setIsEdit] = useState(false);

  const [photoURLs, setPhotoURLs] = useState({});

const columns = useMemo(
  () => [
    {
      Header: 'Nome do Produto',
      accessor: 'nome',
    },
    {
      Header: 'Descrição',
      accessor: 'descricao',
    },
    {
      Header: 'Preço inicial',
      accessor: 'precoMinimo',
    },
    {
      Header: 'Imagem',
      accessor: 'id',
      Cell: ({ row }) => {
        const photoURL = photoURLs[row.original.id];
        return photoURL ? (
          <CardImg
            top
            className="card-img-chat" // Assuming you have a CSS class for styling
            src={photoURL}
            alt={row.original.nome}
            style={{ width: '25px', height: '25px', objectFit: 'cover' }}
          />
        ) : (
          <span>Loading...</span> // Show a placeholder while the image is loading
        );
      },
    },
    {
      Header: 'Ações',
      Cell: ({ row }) => {


        return (
          <div className="d-flex justify-content-center">

              <a
              className={`d-inline-block mx-2 `}
              style={{ fontSize: '24px'}}
              onClick={() => handleProdutoClicksEdit(row.original.id)}
                >
              <i className="bx bx-pencil"></i>
              </a>

            <a
            className="d-inline-block mx-2"
            onClick={() => handleRemove(row.original.id)}
            >
            <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
          </div>
        );
      },
    },
  ],
  [photoURLs]
);
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const valSala = useFormik({
  // enableReinitialize : use this flag when initial values needs to be changed
  enableReinitialize: true,

  initialValues: {
    nome: sala?.nome,
    descricao: sala?.descricao,
    dataAbertura: formatDate(sala?.dataAbertura),
    dataFechamento: formatDate(sala?.dataFechamento),
    nmax: sala?.nmax
  },
  validationSchema: Yup.object({
    nome: Yup.string().required("Please Enter Your Email"),
    descricao: Yup.string().required("Please Enter Your Username"),
    dataAbertura: Yup.string().required("Please Enter Your Password"),
    dataFechamento: Yup.string().required("Please Enter Your Password"),
    nmax: Yup.string().required("Please Enter Your Password"),
  }),
  onSubmit: (values) => {
    
    dispatch(registerUser(values));

  }
});

const valProduct = useFormik({
  // enableReinitialize : use this flag when initial values needs to be changed
  enableReinitialize: true,

  initialValues: {
    id: productData?.id || '',
    nome: productData?.nome || '',
    especificacao: productData?.descricao || '',
    valor: productData?.precoMinimo || '',
    tipo:  productData || '',
    imagem: productData || ''
  },
  
  validationSchema: Yup.object({
    nome: Yup.string().required("Por favor, digite o nome do produto"),
    especificacao: Yup.string().required("Por favor, digite a especificação do produto"),
  }),
  onSubmit: (values) => {
    const handleSubmission2 = async () => {

      const formattedValues = {};
      formattedValues.fornecedorData = formatDate2(values.fornecedor_data);
      formattedValues.fornecedor = values.fornecedor;
      formattedValues.quantidade = values.quantidade;
      formattedValues.validade = formatDate2(values.validade);
      formattedValues.localizacao = values.localizacao;
      formattedValues.observacao = values.observacao;
      formattedValues.tipoComponenteId = inputHiddenId;
      
      try {
        const response = await post('/api/componentes/salvar',formattedValues);
        console.log(response)


        setactiveTab(3)

      //  console.log(props.router.navigate('/componentes/buscar'))
      } catch (error) {
        console.log(error);
        
      }
    };

    const handleUpdate = async (id) => {

      const formattedValues = {};
      formattedValues.fornecedorData = formatDate2(values.fornecedor_data);
      formattedValues.fornecedor = values.fornecedor;
      formattedValues.quantidade = values.quantidade;
      formattedValues.validade = formatDate2(values.validade);
      formattedValues.observacao = values.observacao;
      formattedValues.tipoComponenteId = inputHiddenId;
      
      try {
        const response = await put(`/componentes/update/${id}`,formattedValues);
        console.log(response)

        setactiveTab(3)

      //  console.log(props.router.navigate('/componentes/buscar'))
      } catch (error) {
        console.log(error);
        
      }
    };

  if(inputHiddenId != 0 && values.id){
    handleUpdate(values.id);
  }else{
    handleSubmission2();
  }
    
}
});

  const fetchUnities = async (page) => {
    try {
      setLoading(true);
      const response = await get(`/api/produtos/getbysalauuid2/${uuid}`, {});
      console.log('response');
      console.log(response);

      const productsById = response.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      setProductDataArray(productsById);
      setData(response);

      // Fetch images for each product
      const photoURLsMap = await Promise.all(
        response.map(async (produto) => {
          const photoURL = await getPhotoOfProduct(produto.id);
          return { id: produto.id, photoURL };
        })
      );

      const photoURLsObject = photoURLsMap.reduce((acc, curr) => {
        if (curr.photoURL) {
          acc[curr.id] = curr.photoURL;
        }
        return acc;
      }, {});

      setPhotoURLs(photoURLsObject);
      setLoading(false);


    } catch (error) {
      if (error?.message == "Request failed with status code 403") {
        dispatch(logoutUser(history));
      }
    }
  };

  const fetchSalas = async (page) => {
    try {
      setLoading(true);
      const response = await get(`/api/salas/getbyuuid/${uuid}`, {});
      console.log('salasx');
      console.log(response);
      
      setSala(response);

      setLoading(false);


    } catch (error) {
      if (error?.message == "Request failed with status code 403") {
        dispatch(logoutUser(history));
      }
    }
  };

  const getPhotoOfProduct = async (productId) => {
    try {
      const response = await get(`/api/produtoimages/getphoto/${productId}`, {
        responseType: 'arraybuffer' // Specify responseType as 'arraybuffer' to receive binary data
      });
      console.log("responsephoto", response);
      
      // Create a Blob from the array buffer
      const blob = new Blob([response], { type: 'image/jpeg' });

      // Create a URL for the blob
      const photoURL = URL.createObjectURL(blob);

      return photoURL;
    } catch (error) {
      console.error('Error fetching photo:', error);
      return null;
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await del(`/api/salas/delete/${id}`);
      alert('Produto deletado com sucesso!')
      fetchUnities(0);
    } catch (error) {
      if (error?.message) {
        alert(message)
      }
    }
  
  }

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    setAuthToken(obj?.token);
    fetchUnities(0);
    fetchSalas();
  }, []);

  const toggle = () => {
    if (modal) {
      setModal(false);
      //setOrder(null);
    } else {
      setModal(true);
    }
  };

  const toggle1 = () => {
    if (modal1) {
      setModal1(false);
      //setOrder(null);
    } else {
      setModal1(true);
    }
  };

  const handleSalaClicks = () => {
    toggle();
  };
  const handleProdutoClicksAdd = () => {
    toggle1();
    setIsEdit(false);
    setProductData(null);
  };

  const handleProdutoClicksEdit = (productId) => {
    setIsEdit(true);
    setProductData(productDataArray[productId]); // Pass the product data for editing
    toggle1();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Gerenciar")}
            breadcrumbItem={props.t("Minhas Salas")}
          />
              <Card className="p-3">
              <CardTitle>Edição de Sala</CardTitle>

                <TableContainer
                    columns={columns}
                    data={data}
                    className="custom-header-css"
                    handleSalaClicks={handleSalaClicks}
                    handleProdutoClicks={handleProdutoClicksAdd}
                />

              </Card>
        </Container>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} tag="h4">
            Formulario da Sala
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                valSala.handleSubmit();
                return false;
              }}
            >
              <Row>
                
                <div className="mb-3">
                  <Label className="form-label">Nome da sala</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Insert Order Id"
                    onChange={valSala.handleChange}
                    onBlur={valSala.handleBlur}
                    value={valSala.values.nome || ""}
                    invalid={
                      valSala.touched.nome && valSala.errors.nome ? true : false
                    }
                  />
                  {valSala.touched.nome && valSala.errors.nome ? (
                    <FormFeedback type="invalid">{valSala.errors.nome}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Descrição</Label>
                  <Input
                    name="descricao"
                    type="text"
                    placeholder="Insira a descrição da sala"
                    onChange={valSala.handleChange}
                    onBlur={valSala.handleBlur}
                    value={valSala.values.descricao}
                    invalid={valSala.touched.descricao && valSala.errors.descricao ? true : false}
                  />
                  {valSala.touched.descricao && valSala.errors.descricao ? (
                    <FormFeedback type="invalid">{valSala.errors.descricao}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Data de Abertura</Label>
                  <Input
                    name="dataAbertura"
                    type="date"
                    placeholder="Insira a data de abertura"
                    onChange={valSala.handleChange}
                    onBlur={valSala.handleBlur}
                    value={valSala.values.dataAbertura}
                    invalid={valSala.touched.dataAbertura && valSala.errors.dataAbertura ? true : false}
                  />
                  {valSala.touched.dataAbertura && valSala.errors.dataAbertura ? (
                    <FormFeedback type="invalid">{valSala.errors.dataAbertura}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Data de Fechamento</Label>
                  <Input
                    name="dataFechamento"
                    type="date"
                    placeholder="Insira a data de fechamento"
                    onChange={valSala.handleChange}
                    onBlur={valSala.handleBlur}
                    value={valSala.values.dataFechamento}
                    invalid={valSala.touched.dataFechamento && valSala.errors.dataFechamento ? true : false}
                  />
                  {valSala.touched.dataFechamento && valSala.errors.dataFechamento ? (
                    <FormFeedback type="invalid">{valSala.errors.dataFechamento}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Número Máximo de Participantes</Label>
                  <Input
                    name="nmax"
                    type="number"
                    placeholder="Insira o número máximo de participantes"
                    onChange={valSala.handleChange}
                    onBlur={valSala.handleBlur}
                    value={valSala.values.nmax}
                    invalid={valSala.touched.nmax && valSala.errors.nmax ? true : false}
                  />
                  {valSala.touched.nmax && valSala.errors.nmax ? (
                    <FormFeedback type="invalid">{valSala.errors.nmax}</FormFeedback>
                  ) : null}
                </div>
                
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-success save-user"
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={modal1} toggle={toggle1}>
          <ModalHeader toggle={toggle1} tag="h4">
            {!!isEdit ? "Edit Order" : "Add Order"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                valProduct.handleSubmit();
                return false;
              }}
            >
              <Row>
                <Col className="col-12">
                  <div className="mb-3">
                    <Label className="form-label">Nome</Label>
                    <Input
                      name="nome"
                      type="text"
                      placeholder="Insira o nome"
                      onChange={valProduct.handleChange}
                      onBlur={valProduct.handleBlur}
                      value={valProduct.values.nome || ""}
                      invalid={
                        valProduct.touched.nome && valProduct.errors.nome ? true : false
                      }
                    />
                    {valProduct.touched.nome && valProduct.errors.nome ? (
                      <FormFeedback type="invalid">{valProduct.errors.nome}</FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">Descrição</Label>
                    <Input
                      name="billingName"
                      type="text"
                      placeholder="Insira a descrição do produto"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={valProduct.handleChange}
                      onBlur={valProduct.handleBlur}
                      value={valProduct.values.especificacao || ""}
                      invalid={
                        valProduct.touched.especificacao && valProduct.errors.especificacao ? true : false
                      }
                    />
                    {valProduct.touched.especificacao && valProduct.errors.especificacao ? (
                      <FormFeedback type="invalid">{valProduct.errors.especificacao}</FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">ATIVO</Label>
                    <Input
                      name="badgeclass"
                      type="select"
                      className="form-select"
                      onChange={valProduct.handleChange}
                      onBlur={valProduct.handleBlur}
                      value={valProduct.values.badgeclass || ""}
                    >
                      <option>Sim</option>
                      <option>Não</option>
                    </Input>
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">Preço mínimo</Label>
                    <Input
                      name="billingName"
                      type="text"
                      placeholder="Insira o lance mínimo do produto"
                      validate={{
                        required: { value: true },
                      }}
                      onChange={valProduct.handleChange}
                      onBlur={valProduct.handleBlur}
                      value={valProduct.values.valor || ""}
                      invalid={
                        valProduct.touched.valor && valProduct.errors.valor ? true : false
                      }
                    />
                    {valProduct.touched.valor && valProduct.errors.valor ? (
                      <FormFeedback type="invalid">{valProduct.errors.valor}</FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-success save-user"
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(SalasGerenciarEdit);
