import React, {  useState,useMemo, useEffect  } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  CardTitle
} from "reactstrap";
import { Link } from "react-router-dom";
//Import Breadcrumb
import { del, get, post, put,setAuthToken  } from "../../helpers/api_helper";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from '../../components/Common/TableContainerNoFilter';
import Pagination from '../../components/Common/Pagination';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/actions";
//i18n
import { withTranslation } from "react-i18next";
const Dashboard = props => {


  const history = useNavigate();
  const dispatch = useDispatch();

const [perPage, setPerPage] = useState(10);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [totalRows, setTotalRows] = useState(1);
const [currentPage, setCurrentPage] = useState(0);
const [paginationKey, setPaginationKey] = useState(Date.now());

const columns = useMemo(
  () => [
    {
      Header: 'Nome da Sala',
      accessor: 'nome',
    },
    {
      Header: 'Data de Abertura da sala',
      accessor: 'dataCriacao',
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: 'Data e horario maximo permitido de entrada',
      accessor: 'dataFechamento',
      Cell: ({ value }) => formatDateTime(value),
    },
    {
      Header: 'Estado da sala',
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center">
           {row.original?.estado }
        </div>
      ),
    },
    {
      Header: 'Ações',
      Cell: ({ row }) => {
        const currentDate = new Date();
        const fechamentoDate = new Date(row.original?.dataFechamento);

        const isDisabled = currentDate > fechamentoDate;

        return (
          <div className="d-flex justify-content-center">
            <Link
              to={`/leiloes/sala/${row.original.uuid}`}
              className={`d-inline-block mx-2 ${isDisabled ? 'disabled' : ''}`}
              onClick={(e) => isDisabled && e.preventDefault()}
              style={{ fontSize: '24px', color: isDisabled ? '#ccc' : '#556ee6' }}
            >
              <i className="bx bx-send"></i>
            </Link>
            <Link
              to={`/salas/editar/${row.original.uuid}`}
              className={`d-inline-block mx-2 `}
              style={{ fontSize: '24px'}}
            >
              <i className="bx bx-pencil"></i>
            </Link>

            <a
            className="d-inline-block mx-2"
            onClick={() => handleRemove(row.original.uuid)}
            >
            <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
            </a>
          </div>
        );
      },
    },
  ],
  []
);
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const handleRemove = async (uuid) => {
  try {
    const response = await del(`/api/salas/delete/${uuid}`);
    fetchUnities(0);
  } catch (error) {
    if (error?.message) {
      alert(message)
    }
  }


}
const fetchUnities = async (page) => {
  try {
    setLoading(true);
    const response = await get('/api/salas/buscar/mypages', {
      params: {
        page: page,
        size: perPage,
      },
    });
    console.log('response');
    console.log(response.content);

    setData(response.content);
    setTotalRows(response.totalPages)
    setLoading(false);
    //setPaginationKey(Date.now()); 
    setCurrentPage(response.number)

  } catch (error) {
    if (error?.message == "Request failed with status code 403") {
      dispatch(logoutUser(history));
    }
  }
};

const handleInputSearch = async (buscaString) => {
  try {
    setLoading(true);
    setCurrentPage(0)
    const response = await post('/api/salas/buscar',
    {
      searchRequest: buscaString
    },
     {
      params: {
        page: 0,
        size: perPage,
      },
    });
    console.log("response")
    console.log(response)
    setData(response.content);


   let total = response.totalPages == 0 ? 1 : response.totalPages
    setTotalRows(total)
    setLoading(false);
    //setPaginationKey(Date.now()); 
    setCurrentPage(response.number)
  } catch (error) {
    //setError(error);
    setLoading(false);
    console.log(error)
  }
};


  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    setAuthToken(obj?.token);
    fetchUnities(0);
  }, []);

  const handlePageChange = page => {
		fetchUnities(page-1);
	};

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />
              <Card className="p-3">
              <CardTitle>Leilões criados por mim</CardTitle>
                
                <TableContainer
                    columns={columns}
                    data={data}
                    className="custom-header-css"
                    handleInputSearch={handleInputSearch}
                    onPageChange={handlePageChange}
                />
                <Pagination  key={loading} currentPage={currentPage+1}
                 totalPages={totalRows} onPageChange={handlePageChange} />
              </Card>
          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
