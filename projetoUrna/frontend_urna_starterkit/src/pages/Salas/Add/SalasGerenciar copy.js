import React, { useState } from "react"
import { del, get, post, postFile } from "../../../helpers/api_helper";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  Button,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  FormFeedback, 
  Label,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap"
import Select from "react-select"
import { Link } from "react-router-dom"

import classnames from "classnames"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

//Import Images
import img1 from "../../../assets/images/product/img-1.png"
import img7 from "../../../assets/images/product/img-7.png"
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";





const SalasGerenciar = () => {

  //meta title
  document.title="Checkout | Skote - React Admin & Dashboard Template";

  const [activeTab, setactiveTab] = useState("1")

  const [products, setProducts] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [productImage, setProductImage] = useState(null);

  const { demoData } = useSelector(state => ({
    demoData: state.Login.demoData,
  }));

  const mytoken =  demoData?.token

  const handleImageChange = (event) => {

    setProductImage(event.target.files[0]);

  };

  const [formData, setFormData] = useState({
    nome: '', 
    dataAbertura: '',
    dataFechamento: '',
    ativa: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
  
    initialValues: {
      id: '',
      nome: '',
      especificacao: '',
      valor: '',
      ativo:  '',
      imagem: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome do tipo de componente"),
      especificacao: Yup.string().required("Por favor, digite a especificacao do tipo de componente"),
      valor: Yup.number().required("Por favor, digite o valor do tipo de componente"),

    }),
    onSubmit: (values) => {
      const handleSubmission = async () => {
        const newProduct = {
          nome: values.nome,
          especificacao: values.especificacao,
          valor: values.valor,
          ativo: values.tipo,
          imagem: productImage != null ? productImage : null
        };
        setProducts([...products, newProduct]);

        const newProduct2 = {
          nome: values.nome,
          especificacao: values.especificacao,
          valor: values.valor,
          ativo: values.tipo,
        };
        setProducts2([...products2, newProduct2]);
        
      };
    
      handleSubmission();
  }
  });

  const sendForm = async () => {
    console.log('foi')
    try {
      const response = await post(`/api/salas/salvar/`, formData);
      
      if(response.id){
        const salaId = response.id;
        await Promise.all(products.map(async (product) => {
          
            const response = await post(`/api/produtos/salvar/${salaId}`, product);
            console.log('foi')
            console.log(response)
          
        }));

      }

    } catch (error) {
      console.log(error)
    }

  };

  const sendForm2 = async () => {
    console.log('foi1')
    try {

        const apiUrl =process.env.REACT_APP_API_URL


        const formDataf = new FormData();
        formDataf.append('nome', products[0]);
        formDataf.append('especificacao',products[0]);
        formDataf.append('valor', products[0]);
        formDataf.append('file', productImage);
        
              
            const response2 = await axios.post(`${apiUrl}/api/produtos/salvar2`, formDataf,{
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': mytoken
              }});
              
            console.log('foi')
            console.log(response2)         

    } catch (error) {
      console.log(error)
    }

  };
  console.log(products)
  console.log(formData)
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Checkout" />

          <div className="checkout-tabs">
            <Row>
              <Col lg="2" sm="3">
                <Nav className="flex-column" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        setactiveTab("1")
                      }}
                    >
                      <i className="bx bxs-truck d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Informação da sala</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        setactiveTab("2")
                      }}
                    >
                      <i className="bx bx-money d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Formulário de Produtos</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        setactiveTab("3")
                      }}
                    >
                      <i className="bx bx-badge-check d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Informações da seção</p>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col lg="10" sm="9">
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div>
                          <CardTitle>Informação da sala</CardTitle>
                          <p className="card-title-desc">
                            Descreva as informações da sala nos campos abaixo.
                          </p>
                          <Form>
                            <FormGroup className="mb-4" row>
                              <Label htmlFor="nome" md="2" className="col-form-label">
                                Nome da sala*
                              </Label>
                              <Col md={10}>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="nome"
                                  placeholder="Digite o nome da sala."
                                  value={formData.nome}
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className="mb-4" row>
                              <Label htmlFor="data-abertura" md="2" className="col-form-label">
                                Horário de Abertura*
                              </Label>
                              <Col md="10">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="dataAbertura"
                                  placeholder="Horário de Abertura"
                                  value={formData.dataAbertura}
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className="mb-4" row>
                              <Label htmlFor="data-fechamento" md="2" className="col-form-label">
                                Horário limite de entrada*
                              </Label>
                              <Col md="10">
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id="dataFechamento"
                                  placeholder="Horário limite de entrada"
                                  value={formData.dataFechamento}
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className="select2-container mb-4" row>
                              <Label md="2" className="col-form-label">
                                Sala ativa* ?
                              </Label>
                              <Col md="10">
                                <select
                                  className="form-control select2"
                                  id="ativa"
                                  value={formData.ativa}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Selecione</option>
                                  <option value="0">Não</option>
                                  <option value="1">Sim</option>
                                </select>
                              </Col>
                            </FormGroup>
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId="2">
                      <CardTitle>Informação dos produtos</CardTitle>
                          <p className="card-title-desc">
                            Adicione um produto na sala
                          </p>
                        <Form
                            className="form-horizontal"
                            onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                        >

                          <div className="mb-3">
                            <Row>
                              <Col md={6}>
                                <Label className="form-label">Nome do produto*</Label>
                                <Input
                                  name="nome"
                                  className="form-control"
                                  placeholder="Digite o nome do Tipo de Componente"
                                  type="nome"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.nome || ""}
                                  invalid={
                                    validation.touched.nome && validation.errors.nome ? true : false
                                  }
                                />
                                {validation.touched.nome && validation.errors.nome ? (
                                  <FormFeedback type="invalid">{validation.errors.nome}</FormFeedback>
                                ) : null}
                              </Col>
                              <Col md={6}>
                                <Label className="form-label">Descrição*</Label>
                                <Input
                                  name="especificacao"
                                  className="form-control"
                                  placeholder="Digite a especificação do tipo de Componente"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.especificacao || ""}
                                  invalid={
                                    validation.touched.especificacao && validation.errors.especificacao ? true : false
                                  }
                                />
                                {validation.touched.especificacao && validation.errors.especificacao ? (
                                  <FormFeedback type="invalid">{validation.errors.especificacao}</FormFeedback>
                                ) : null}
                              </Col>

                            </Row>
                          </div>
                          <div className="mb-3">
                            <Row>
                              <Col md={6}>
                                <Label className="form-label">Preço inicial (R$)*</Label>
                                <Input
                                  name="valor"
                                  className="form-control"
                                  placeholder="Digite o valor do tipo de Componente"
                                  type="number"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.valor || ""}
                                  invalid={
                                    validation.touched.valor && validation.errors.valor ? true : false
                                  }
                                />
                                {validation.touched.valor && validation.errors.valor ? (
                                  <FormFeedback type="invalid">{validation.errors.valor}</FormFeedback>
                                ) : null}
                              </Col>
                              <Col md={6}>
                                <Label className="form-label">ativo</Label>
                                <Input
                                type="select"
                                name="tipo"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tipo || ""}
                                invalid={validation.touched.tipo && validation.errors.tipo}
                              >
                                <option value="">Selecione</option>
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                              </Input>
                              {validation.touched.tipo && validation.errors.tipo && (
                                <FormFeedback type="invalid">{validation.errors.tipo}</FormFeedback>
                              )}
                              </Col>
                            </Row>
                            
                          </div>
                          <div className="mb-3">
                            <Row>
                              <Col md={6}>
                              <Label className="form-label">Imagem</Label>
                                <Input
                                  name="imagem"
                                  className="form-control"
                                  placeholder="Selecione a imagem do produto"
                                  accept="image/*"
                                  type="file"
                                  onChange={handleImageChange}

                                />
                              </Col>
                            </Row>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary w-md">
                              Adicionar produto a lista
                            </button>
                          </div>
                        </Form>
                      </TabPane>
                      <TabPane tabId="3" id="v-pills-confir" role="tabpanel">
                        <Card className="shadow-none border mb-0">
                          <CardBody>
                            <CardTitle className="mb-4">
                              Prévia do leilão da sua sala
                            </CardTitle>

                            <div className="table-responsive">
                              <Table className="table align-middle mb-0 table-nowrap">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">Produto</th>
                                    <th scope="col">Descrição do produto</th>
                                    <th scope="col">l. mínimo</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((orderitem, key) => (
                                    
                                    <tr key={"_orderSummary_" + key}>
                                      <th scope="row">
                                        <img
                                          src={URL.createObjectURL(orderitem.imagem)}
                                          alt="product-img"
                                          title="product-img"
                                          className="avatar-md"
                                        />
                                      </th>
                                      <td>
                                        <h5 className="font-size-14 text-truncate">
                                          <Link
                                            to="/ecommerce-product-detail"
                                            className="text-dark"
                                          >
                                            {orderitem.nome}{" "}
                                          </Link>
                                        </h5>
                                        <p className="text-muted mb-0">
                                          {orderitem.especificacao} 
                                        </p>
                                      </td>
                                      <td>
                                        R$ {orderitem.valor}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan="2">
                                      <h6 className="m-0 text-end">
                                        Sub Total:
                                      </h6>
                                    </td>
                                    <td>
                                      $ 675
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3">
                                      <div className="bg-primary bg-soft p-3 rounded">
                                        <h5 className="font-size-14 text-primary mb-0">
                                          <i className="fas fa-shipping-fast me-2" />{" "}
                                          Nome da sala:{" "} {formData.nome}
                                          <span className="float-end">
                                            Data de abertura: {formData.dataAbertura}
                                          </span>
                                        </h5>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="2">
                                      <h6 className="m-0 text-end">Horário máximo de entrada</h6>
                                    </td>
                                    <td>{formData.dataFechamento}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
                <Row className="mt-4">
                  <Col sm="6">
                    <Link
                      to="/ecommerce-cart"
                      className="btn text-muted d-none d-sm-inline-block btn-link"
                    >
                      <i className="mdi mdi-arrow-left me-1" /> Back to
                      Shopping Cart{" "}
                    </Link>
                  </Col>
                  <Col sm="6">
                    <div className="text-sm-end">
                      <Button
                        to="/ecommerce-checkout"
                        className="btn btn-success"
                        onClick={() => {
                          sendForm2();
                        }}
                      >
                        <i className="mdi mdi-truck-fast me-1" /> Cadastrar sala{" "}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SalasGerenciar
