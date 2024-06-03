import React, {  useState,useMemo, useEffect  } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
  Label 
} from "reactstrap";
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
const UserProfileExperimentoAdd = props => {

  const { disciplinaId } = useParams();

  const columns = useMemo(
    () => [

      {
        Header: 'Nome',
        accessor: 'experimentoId.nome',
      },
      {
        Header: 'Observações',
        accessor: 'experimentoId.obs',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">


            <Link to={`/experimentoadd/${row.original.experimentoId.id}`} className="d-inline-block mx-2">
              <i className="bx bx-add-to-queue" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
           </Link> 

            <a
              className="d-inline-block "
              onClick={() => handleEdit(row.original.experimentoId.id)}//experimentoId
              title="Editar experimento"
            >
              <i className="bx bx-edit-alt" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
            </a>

            <a
              className="d-inline-block mx-2"
              onClick={() => handleRemove(row.original.experimentoId.id)}//experimentoId
              title="Apagar experimento"
            >
              <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
            
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationKey, setPaginationKey] = useState(Date.now());

  const [isEditing, setIsEditing] = useState(false);


  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [colorAlert, setcolorAlert] = useState('success');

  const [col5, setcol5] = useState(true);


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: '',
      nome: '',
      obs: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
    }),
    onSubmit: (values) => {
      // table experimento
      const handleSubmission = async () => {
        try {
          const response = await post(`/api/experimento/salvar/${disciplinaId}`, {
            nome: values.nome.trimStart(),
            obs: values.obs.trimStart()
          });
          
          setAlert(true);
          setAlertMsg('Disciplina salva com sucesso!');
          setcolorAlert('success');
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' ,
            obs: ' '
          });

          setIsEditing(false);

        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
      };
      //table experimento
      const handleUpdate = async (experimentoId) => {
        // Function for handling edit action
        console.log(`Edit clicked for experimentoId ${experimentoId}`);
    
        try {
          console.log(values)
          const response = await put(`/experimento/update/${experimentoId}`, {
            id: values.id,
            nome: values.nome,
            obs: values.obs
          });
    
          setAlert(true);
          setAlertMsg('Experimento atualizado com sucesso!');
          setcolorAlert('success');
          
          
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });
          
          setIsEditing(false);
    
        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
    
      };
    
      if(values.id){
        handleUpdate(values.id);
      }else{
        handleSubmission();
      }
      

  }
  });
  // fetch users
  const fetchUsers = async (page) => {

    

    console.log(disciplinaId)
    
    try {
      setLoading(true);
      const response = await get('/api/vinculos/mydisciplinas/experimentos/findall', {
        params: {
          page: page,
          size: perPage,
          disciplinaId: disciplinaId
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
  // get one experimento to uodate
  const handleEdit = async (experimentoId) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${experimentoId}`);

    try {
      const response = await get(`/api/experimento/mydisciplinas/findbyid/${experimentoId}`);
      
      console.log(response)

      validation.setValues({
        id: response.id,
        nome: response.nome,
        obs: response.obs
      });

      setIsEditing(true);

    } catch (error) {
      console.log(error);
      setAlert(true);
      setAlertMsg('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setcolorAlert('danger');
    }

  };



  const handleRemove = async (experimentoId) => {
    // Function for handling remove action
    try {
      setLoading(true);
      const response = await del(`/experimento/delete/${experimentoId}`);

      setAlert(true);
      setAlertMsg('Experimento Apagado com sucesso!');
      setcolorAlert('success');
      fetchUsers(currentPage);

      setIsEditing(false);

    } catch (error) {
      //setError(error);
      setLoading(false);
      setAlert(true);
      setAlertMsg('Error ao apagar a disciplina');
      setcolorAlert('danger');
      console.log(error);
    }

  };

  const handleAdd = async (experimentoId) => {
    // Function for handling remove action
    try {
      setLoading(true);
      const response = await del(`/experimento/delete/${experimentoId}`);

      setAlert(true);
      setAlertMsg('Disciplina Apagada com sucesso!');
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
  const handleClearForm = () => {
    validation.resetForm(); // This will reset all form fields and errors
  };

  const handleInputSearch = async (buscaString) => {
    try {
      setLoading(true);
      setCurrentPage(0)
      const response = await post('/api/disciplinas/buscar',
      {
        searchRequest: buscaString
      },
      {
        params: {
          page: 0,
          size: perPage,
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
            title={props.t("Profile")}
            breadcrumbItem={props.t("Experimento")}
          />

          
            <Card className="p-3">
            <Alert color={colorAlert} isOpen={alert} toggle={() => {
                setAlert(false)
              }}>
                {alertMsg}
            </Alert>
              <CardBody>
                  <CardTitle>Experimentos Cadastrados</CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de experimentos cadastrados
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
            </Card>

            <Card className="p-3">


            <CardBody>
                  <CardTitle>{isEditing ? 'Editar Experimento' : 'Adicionar Experimento'}</CardTitle>
                  <CardSubtitle className="font-14 text-muted">
                    Use o campo abaixo para adicionar uma disciplina ao sistema.
                  </CardSubtitle>
                  <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                    <div className="mb-3">
                      <Label className="form-label">Nome</Label>
                      <Input
                        name="nome"
                        className="form-control"
                        placeholder="Digite o nome da disciplina"
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
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Observação</Label>
                      <Input
                        name="obs"
                        className="form-control"
                        placeholder="Digite o nome da disciplina"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.obs || ""}
                        invalid={
                          validation.touched.obs && validation.errors.obs ? true : false
                        }
                      />
                      {validation.touched.obs && validation.errors.obs ? (
                        <FormFeedback type="invalid">{validation.errors.obs}</FormFeedback>
                      ) : null}
                    </div>
                    <div className="d-flex justify-content-end ">
                    <Button color="secondary" type="submit" className="me-2" onClick={handleClearForm}>
                        Limpar formulário
                    </Button>
                      <Button color="primary" type="submit">
                        {isEditing ? 'Editar formulário' : 'Submeter formulário'}
                      </Button>
                    </div>

                    </Form>
            </CardBody>
            </Card>
          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(UserProfileExperimentoAdd);
