import React, {  useState,useMemo, useEffect, useCallback  } from "react";
import styles from "./style.module.css";
import {
  Button,
  Container,
  Card,
  Alert,
  Collapse,
  CardBody,
  CardTitle,
  CardSubtitle,
  UncontrolledAlert,  
  Form,
  Input,
  FormFeedback, 
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Label 
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
//Import Breadcrumb
import { del, get, post, put } from "../../helpers/api_helper";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//i18n
import { withTranslation } from "react-i18next";
import { addNewUser } from "store/actions";
const Componentes = props => {
  const { demoData } = useSelector(state => ({
    demoData: state.Login.demoData,
  }));
  
  const loggedUserId  = demoData.data?.id;
  console.log(loggedUserId)
  
  const columns = useMemo(
    () => [

      {
        Header: 'Nome',
        accessor: 'nome',
        Cell: ({ row }) => (
          <span className={row.original.id == loggedUserId ? styles.myLineSelf : styles.myLine}  >
            {row.original.id == loggedUserId ? `(${row.original.nome} - você mesmo)` : row.original.nome}
          </span>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <a
              className="d-inline-block mx-1"
             // onClick={() => handleEdit(row.original.id)}
             onClick={() => toggleRightCanvas(row.original.id)}
             >
              <i className="bx bx-edit-alt" style={{ fontSize: '24px' }}></i>
            </a>
            {row.original.email !== loggedUserId && (
              <a className="d-inline-block mx-1" onClick={() => removeUser(row.original.id)}>
                <i className="bx bx-trash" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
              </a>
            )}
          </div>
        ),
      },
    ],
    [loggedUserId]
  );
  

  console.log(columns)
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [totalRows, setTotalRows] = useState(1);
const [perPage, setPerPage] = useState(10);
const [currentPage, setCurrentPage] = useState(0);
const [paginationKey, setPaginationKey] = useState(Date.now());

//canvas
const [isRight, setIsRight] = useState(false);
const [isRight2, setIsRight2] = useState(false);

const [show, setShow] = useState(false);
const [showBad, setShowBad] = useState(false);

const [alert, setAlert] = useState(false);
const [alertMsg, setAlertMsg] = useState('');
const [colorAlert, setcolorAlert] = useState('success');

const [col5, setcol5] = useState(true);


const validationEdit = useFormik({
  // enableReinitialize : use this flag when initial values needs to be changed
  enableReinitialize: true,

  initialValues: {
    id: 0,
    nome: '',
    email: '',
    senha: '',
    tipo: '',
    isAdmin: ''
  },
  validationSchema: Yup.object({
    nome: Yup.string().required("Por favor, digite o nome"),
    email: Yup.string().required("Por favor, digite o email"),
    tipo: Yup.string().required("Por favor, digite o perfil"),

  }),
  onSubmit: (values) => {


    const handleSubmissionEdit = async (id) => {
      try {
        setLoading(true);
        const response = await put(`/clientes/${id}`, {
          nome: values.nome,
          email: values.email,
          senha: values.senha ? values.senha : '',
          tipo: values.tipo,
          isAdmin: values.tipo
        });
        setLoading(false);
        fetchUsers(currentPage);
        setAlert(true)
        setAlertMsg('A operação foi concluída com sucesso!');
        setcolorAlert('success');

      } catch (error) {
        setLoading(false);
        setAlert(true)
        setAlertMsg('Um erro inesperado aconteceu. Tente novamente mais tarde.');
        setcolorAlert('danger');
        console.log(error);
      }
    };
  
    handleSubmissionEdit(values.id);


}
});

const validationSave = useFormik({
  // enableReinitialize : use this flag when initial values needs to be changed
  enableReinitialize: true,

  initialValues: {
    id: 0,
    nome: '',
    email: '',
    senha: '',
    tipo: '',
    isAdmin: ''
  },
  validationSchema: Yup.object({
    nome: Yup.string().required("Por favor, digite o nome"),
    email: Yup.string().required("Por favor, digite o email"),
    senha: Yup.string().required("Por favor, digite a senha"),
    tipo: Yup.string().required("Por favor, digite o perfil"),

  }),
  onSubmit: (values) => {

  
    const handleSubmissionSave = async () => {
      try {
        setLoading(true);
        const response = await post('/api/clientes', {
          nome: values.nome,
          email: values.email,
          senha: values.senha ? values.senha : '',
          tipo: values.tipo,
          isAdmin: values.tipo

        });
        setLoading(false);
        fetchUsers(currentPage);
        setAlert(true)
        setAlertMsg('A operação foi concluída com sucesso!');
        setcolorAlert('success');

      } catch (error) {
        setLoading(false);
        setAlert(true)
        setAlertMsg('Um erro inesperado aconteceu. Tente novamente mais tarde.');
        setcolorAlert('danger');
        console.log(error);
      }
    };

    handleSubmissionSave()

}
});


const removeUser = async (id) => {
  try {
    setLoading(true);
    const response = await del(`/clientes/delete/${id}`);
    setLoading(false);
    setAlert(true);
    setAlertMsg('Usuário removido com sucesso!');
    setcolorAlert('success');
    fetchUsers(currentPage);
    /*

    fetchUsers(currentPage);*/
  } catch (error) {
    //setError(error);

  }
}
const fetchUsers = async (page) => {
  try {
    setLoading(true);
    const response = await get('/api/clientes/page', {
      params: {
        page: page,
        size: perPage,
      },
    });
    console.log("response")
    console.log(response)
    setData(response.content);
    setTotalRows(response.totalPages)
    setLoading(false);
    //setPaginationKey(Date.now()); 
    setCurrentPage(response.number)

  } catch (error) {
    //setError(error);
    setLoading(false);
    console.log(error)
  }
};
const handleEdit = async (id) => {
  // Function for handling edit action
  console.log(`Edit clicked for id ${id}`);
};

const fetchDetailsUsers = async (id) => {
  try {
    setLoading(true);
    const response = await get(`/api/clientes/findbyid/${id}`);
    console.log("response")
    console.log(response)

    validationEdit.setValues({
      id: id,
      nome: response.nome ,
      email: response.email ,
      tipo: response.tipoNumber 
    });

    console.log(validationEdit)
  } catch (error) {
    //setError(error);
    setLoading(false);

    setAlertMsg('Um erro inesperado aconteceu. Tente novamente mais tarde.');
    setcolorAlert('danger');
    console.log(error);
  }
};
// canvas
const toggleRightCanvas = (id) => {

  if (typeof id === 'number') {
    fetchDetailsUsers(id);
  }

  setIsRight(!isRight);
};

const toggleRightCanvas2 = (id) => {

  validationSave.setValues({
    nome: '',
    email: '',
    senha: '',
    tipo: ''
  });

  setIsRight2(!isRight2);
};
const handleRemove = async (id) => {
  // Function for handling remove action
  try {
    setLoading(true);
    const response = await del(`/disciplinas/delete/${id}`);

    setAlert(true);
    setAlertMsg('Disciplina Apagada com sucesso');
    setcolorAlert('success');
    fetchUsers(currentPage);

  } catch (error) {
    //setError(error);
    setLoading(false);
    setAlert(true);
    setAlertMsg('Error ao apagar a disciplina');
    setcolorAlert('danger');
    console.log(error);
  }

};
const handleInputSearch = async (buscaString) => {
  try {
    setLoading(true);
    setCurrentPage(0)
    const response = await post('/api/clientes/page',
    {
      searchRequest: buscaString
    },
     {
      params: {
        page: 0,
        linesPerPage: perPage,
      },
    });

    setData(response.content);


   let total = response.totalPages == 0 ? 1 : response.totalPages
    setTotalRows(total)
    setLoading(false);
    //setPaginationKey(Date.now()); 
    setCurrentPage(response.number)
  } catch (error) {
    //setError(error);
    setLoading(false);
    setAlertMsg('Um erro inesperado aconteceu. Tente novamente mais tarde.');
    setcolorAlert('danger');
    console.log(error);
  }
};

  useEffect(() => {
    fetchUsers(0);
  }, []);
  const t_col5 = () => {
    setcol5(!col5);
  };
  const handlePageChange = page => {
		fetchUsers(page-1);
	};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Usuários")}
            breadcrumbItem={props.t("Gerenciar")}
          />

          
            <Card className="p-3">
            <Alert color={colorAlert} isOpen={alert} toggle={() => {
                setAlert(false)
              }}>
                {alertMsg}
            </Alert>
              <CardBody>
                  <CardTitle>Lista de Usuários do Sistema</CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de todos os usuários do sistema
                    <button
                    onClick={t_col5}
                    className="btn btn-primary mo-mb-2"
                    type="button"
                    style={{ cursor: "pointer" }}
                  >
                     <i className={`${col5 ? 'bx bx-hide' :'bx bx-show' }`}></i>
                  </button>
                  </CardSubtitle>
 
                </CardBody>
                <Collapse isOpen={col5}>
                  <TableContainer
                      columns={columns}
                      data={data}
                      className="custom-header-css"
                      handleInputSearch={handleInputSearch}
                      onPageChange={handlePageChange}
                  />
                </Collapse>
                <Pagination  key={loading} currentPage={currentPage+1}
                 totalPages={totalRows} onPageChange={handlePageChange} />

                 <hr></hr>
                 <div style={{ textAlign: 'right' }}>
                  <button onClick={toggleRightCanvas2} className="btn btn-outline-primary w-md">Novo Usuário</button>
                 </div>
                 
            </Card>

          </Container>
      </div>
      {/* MODAIS */}
      <Offcanvas
          isOpen={isRight}
          direction="end"
          toggle={toggleRightCanvas}>
          <OffcanvasHeader toggle={toggleRightCanvas}>
              Dados do usuário
              
          </OffcanvasHeader>
          
          <OffcanvasBody>
          <p>Edição de Usuário</p>
          <Form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validationEdit.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Email</Label>
              <Input
                name="email"
                className="form-control"
                placeholder="Enter email"
                type="email"
                onChange={validationEdit.handleChange}
                onBlur={validationEdit.handleBlur}
                value={validationEdit.values.email || ""}
                invalid={
                  validationEdit.touched.email && validationEdit.errors.email ? true : false
                }
              />
              {validationEdit.touched.email && validationEdit.errors.email ? (
                <FormFeedback type="invalid">{validationEdit.errors.email}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">senha</Label>
              <Input
                name="senha"
                value={validationEdit.values.senha || ""}
                type="senha"
                placeholder="Enter senha"
                onChange={validationEdit.handleChange}
                onBlur={validationEdit.handleBlur}
                invalid={
                  validationEdit.touched.senha && validationEdit.errors.senha ? true : false
                }
              />
              {validationEdit.touched.senha && validationEdit.errors.senha ? (
                <FormFeedback type="invalid">{validationEdit.errors.senha}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Nome</Label>
              <Input
                name="nome"
                className="form-control"
                placeholder="Digite o nome da disciplina"
                type="nome"
                onChange={validationEdit.handleChange}
                onBlur={validationEdit.handleBlur}
                value={validationEdit.values.nome || ""}
                invalid={
                  validationEdit.touched.nome && validationEdit.errors.nome ? true : false
                }
              />
              {validationEdit.touched.nome && validationEdit.errors.nome ? (
                <FormFeedback type="invalid">{validationEdit.errors.nome}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
            <Label className="form-label">Perfil</Label>
            <Input
              type="select"
              name="tipo"
              onChange={validationEdit.handleChange}
              onBlur={validationEdit.handleBlur}
              value={validationEdit.values.tipo || ""}
              invalid={validationEdit.touched.tipo && validationEdit.errors.tipo}
            >
              <option value="">Selecione</option>
              <option value="1">Admin</option>
              <option value="0">Comum</option>
            </Input>
            {validationEdit.touched.tipo && validationEdit.errors.tipo && (
              <FormFeedback type="invalid">{validationEdit.errors.tipo}</FormFeedback>
            )}
          </div>
          <div className="d-grid">
            <Button color="primary" type="submit">
              Enviar
            </Button>
          </div>

        </Form>
          </OffcanvasBody>
      </Offcanvas>




      <Offcanvas
          isOpen={isRight2}
          direction="end"
          toggle={toggleRightCanvas2}>
          <OffcanvasHeader toggle={toggleRightCanvas2}>
              Dados do usuário
              
          </OffcanvasHeader>
          
          <OffcanvasBody>
          <p>Edição de Usuário</p>
          <Form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validationSave.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Email</Label>
              <Input
                name="email"
                className="form-control"
                placeholder="Enter email"
                type="email"
                onChange={validationSave.handleChange}
                onBlur={validationSave.handleBlur}
                value={validationSave.values.email || ""}
                invalid={
                  validationSave.touched.email && validationSave.errors.email ? true : false
                }
              />
              {validationSave.touched.email && validationSave.errors.email ? (
                <FormFeedback type="invalid">{validationSave.errors.email}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">senha</Label>
              <Input
                name="senha"
                value={validationSave.values.senha || ""}
                type="senha"
                placeholder="Enter senha"
                onChange={validationSave.handleChange}
                onBlur={validationSave.handleBlur}
                invalid={
                  validationSave.touched.senha && validationSave.errors.senha ? true : false
                }
              />
              {validationSave.touched.senha && validationSave.errors.senha ? (
                <FormFeedback type="invalid">{validationSave.errors.senha}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Nome</Label>
              <Input
                name="nome"
                className="form-control"
                placeholder="Digite o nome da disciplina"
                type="nome"
                onChange={validationSave.handleChange}
                onBlur={validationSave.handleBlur}
                value={validationSave.values.nome || ""}
                invalid={
                  validationSave.touched.nome && validationSave.errors.nome ? true : false
                }
              />
              {validationSave.touched.nome && validationSave.errors.nome ? (
                <FormFeedback type="invalid">{validationSave.errors.nome}</FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
            <Label className="form-label">Perfil</Label>
            <Input
              type="select"
              name="tipo"
              onChange={validationSave.handleChange}
              onBlur={validationSave.handleBlur}
              value={validationSave.values.tipo || ""}
              invalid={validationSave.touched.tipo && validationSave.errors.tipo}
            >
              <option value="">Selecione</option>
              <option value="1">Admin</option>
              <option value="0">Comum</option>
            </Input>
            {validationSave.touched.tipo && validationSave.errors.tipo && (
              <FormFeedback type="invalid">{validationSave.errors.tipo}</FormFeedback>
            )}
          </div>
          <div className="d-grid">
            <Button color="primary" type="submit">
              Enviar
            </Button>
          </div>

        </Form>
          </OffcanvasBody>
      </Offcanvas>

    </React.Fragment>
  );
};


export default withTranslation()(Componentes);
