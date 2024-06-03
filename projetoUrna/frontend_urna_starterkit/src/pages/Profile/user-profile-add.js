import React, {  useState,useMemo, useEffect  } from "react";
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
const Componentes = props => {

  const columns = useMemo(
    () => [
      {
        Header: 'Código',
        accessor: 'id',
      },
      {
        Header: 'Nome',
        accessor: 'nome',
      },
      {
        Header: 'Selecionar',
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">

            {row.original.alreadyAdded == false && (
              <a className="d-inline-block mx-1" onClick={() => addmydiscipline(row.original.id)}>
                <i className="bx bx-checkbox" style={{ fontSize: '24px' }}></i>
              </a>
            )}
              {row.original.alreadyAdded == true && (
              <div className="d-inline-block mx-1" onClick={() =>  removemydiscipline(row.original.id)} >
                <i className="bx bx-check-square" style={{ fontSize: '23px', color: '#556ee6'  }}></i>
              </div>
            )}
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

  const [show, setShow] = useState(false);
  const [showBad, setShowBad] = useState(false);

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
    },
    validationSchema: Yup.object({
      nome: Yup.string().required("Por favor, digite o nome da disciplina"),
    }),
    onSubmit: (values) => {

      const handleSubmission = async () => {
        try {
          const response = await post('/api/disciplinas/salvar', {
            nome: values.nome.trimStart()
          });
          
          setAlert(true);
          setAlertMsg('Disciplina salva com sucesso!');
          setcolorAlert('success');
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });

        } catch (error) {
          console.log(error);
          setShowBad(true);
        }
      };

      const handleUpdate = async (id) => {
        // Function for handling edit action
        console.log(`Edit clicked for id ${id}`);
    
        try {
          const response = await put(`/disciplinas/update/${id}`, {
            nome: values.nome.trimStart()
          });
    
          setAlert(true);
          setAlertMsg('Disciplina atualizada com sucesso!');
          setcolorAlert('success');
          
          setShow(true);
          fetchUsers(currentPage);

          validation.setValues({
            id: '',
            nome: ' ' 
          });
          
    
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

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await get('/api/disciplinas/buscar', {
        params: {
          page: page,
          size: perPage,
        },
      });

      const response2 = await get('/api/vinculos/mydisciplinas', {
        params: {
          page: 0,
          size: 1000,
        },
      });



      const allDisciplines = response.content;
      const privateDisciplines = response2.content.map(item => item.disciplinaId);

      //const filteredDisciplines = allDisciplines.filter(discipline => !privateDisciplines.includes(discipline.id));

      const modifiedDisciplines = allDisciplines.map(discipline => ({
        ...discipline,
        alreadyAdded: privateDisciplines.some(privateDiscipline => privateDiscipline.id === discipline.id),
      }));

      console.log("response3")
      console.log(modifiedDisciplines)

      setData(modifiedDisciplines);
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
  const addmydiscipline = async (id) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${id}`);

    try {
      const response = await post('/api/vinculos/salvar', {
        disciplinaId: id,
      });

      setAlert(true);
      setAlertMsg('Disciplina adicionada com sucesso!');
      setcolorAlert('success');
      fetchUsers(currentPage);

    } catch (error) {
      console.log(error);
      setShowBad(true);

      setAlert(true);
      setAlertMsg('Um erro inesperado ocorreu ao cadastrar a disciplina. Tente novamente mais tarde.');
      setcolorAlert('danger');
      fetchUsers(currentPage);

    }

  };



  const removemydiscipline = async (id) => {
    // Function for handling edit action
    console.log(`Edit clicked for id ${id}`);

    try {
      const response = await del(`/vinculos/delete/${id}`);

      setAlert(true);
      setAlertMsg('Disciplina desvinculada com sucesso!');
      setcolorAlert('warning');
      fetchUsers(currentPage);

    } catch (error) {
      console.log(error);
      if(error.response.data.message == "deletion is not allowed"){
        setAlert(true);
        setAlertMsg('Não é possivel desvincular disciplinas com experimentos.');
        setcolorAlert('danger');
        fetchUsers(currentPage);
      }else {
        setAlert(true);
        setAlertMsg('Ocorreu um erro interno. Tente novamente mais tarde.');
        setcolorAlert('danger');
        fetchUsers(currentPage);
      }
      



    }

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
            title={props.t("Disciplinas")}
            breadcrumbItem={props.t("Adicionar")}
          />

          
            <Card className="p-3">
            <Alert color={colorAlert} isOpen={alert} toggle={() => {
                setAlert(false)
              }}>
                {alertMsg}
            </Alert>
              <CardBody>
                  <CardTitle>Adicionar Nova Disciplinas </CardTitle>
                  <CardSubtitle className={`font-14 text-muted ${styles.myButton  } `}>
                    Abaixo contém a lista de disciplinas registradas no sistema.
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


          </Container>
      </div>
    </React.Fragment>
  );
};


export default withTranslation()(Componentes);
