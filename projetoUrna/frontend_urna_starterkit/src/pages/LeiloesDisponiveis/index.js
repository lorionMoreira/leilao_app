import React, {  useState,useMemo, useEffect  } from "react";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
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
import TableContainer from '../../components/Common/TableContainerTrue';
import Pagination from '../../components/Common/Pagination';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/actions";
//i18n
import { withTranslation } from "react-i18next";

var stompClient =null;

const LeiloesDisponiveis = props => {
  const { demoData } = useSelector(state => ({
    demoData: state.Login.demoData,
  }));

  //const mytoken =  demoData?.token
  const mytoken =  demoData?.data?.id
  console.log("demoData")

  console.log(demoData)

  const history = useNavigate();
  const dispatch = useDispatch();

const [perPage, setPerPage] = useState(10);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [totalRows, setTotalRows] = useState(1);
const [currentPage, setCurrentPage] = useState(0);
const [hash, setHash] = useState('');


const columns = useMemo(
  () => [

    {
      Header: 'Nome da Sala',
      accessor: 'nome',
    },
    {
      Header: 'Autor',
      accessor: 'user.nome',
    },
    {
      Header: 'Data de Abertura da sala',
      accessor: 'dataCriacao',
    },
    {
      Header: 'Data e horario maximo permitido de entrada',
      accessor: 'dataFechamento',
    },
    {
      Header: 'Lugares disponíveis',
      accessor: 'ncurrent',
    },
    {
      Header: 'Ações',
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center">



          <Link to={`/leiloes/sala/${row.original.uuid}`} className="d-inline-block mx-2">
            <i className="bx bx-send" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
          </Link>

          <Link to={`/componentes/adicionar2/${row.original.id}`} className="d-inline-block mx-2">
            <i className="bx bx-pencil" style={{ fontSize: '24px', color: '#556ee6'  }}></i>
          </Link>


          <a
            className="d-inline-block mx-2"
            onClick={() => handleRemove(row.original.id)}
          >
            <i className="bx bx-trash-alt" style={{ fontSize: '24px', color: '#DC143C'  }}></i>
          </a>


        </div>
      ),
    },

  ],
  []
);
/*
const sendMessage = () => {
  stompClient.send('/app/getListLeiloes', {}, JSON.stringify({}));
};

useEffect(() => {
  const intervalId = setInterval(() => {
    sendMessage();
  }, 3000);

  // Clear the interval when the component is unmounted or no longer needed
  return () => clearInterval(intervalId);
}, []);
*/
const getTickets = async () => {
  try {
    setLoading(true);
    const response = await get('/api/clientes/generateHash');
    setHash(response)
    connect(response);
  } catch (error) {

  }
};

const connect =(response)=>{

  let Sock = new SockJS(`http://localhost:8080/websocket?token=${response}`);
  stompClient = over(Sock);
  stompClient.connect({dsadsa: 'saddas'},onConnected, onError);
}
// here
const onConnected = () => {
  //get
  
  console.log('Connected to WebSocket');
  stompClient.subscribe('/topic/salas', onProductMessageReceived);
  //send

  stompClient.send('/app/getListLeiloes', {}, JSON.stringify({}));
  
}
const onError = (error) => {
  console.error('Error connecting to WebSocket2:', error);
};


// onCOnnected
const onProductMessageReceived = (message) => {
  const response = JSON.parse(message.body);
  console.log('Received product information:', response);
  // Handle received product information as needed in your React application
  // You can set the product information to state or perform other actions
  
  console.log(response)
  setData(response);

  setLoading(false);
  //setPaginationKey(Date.now()); 

  
};
//


  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    setAuthToken(obj?.token);
    //fetchUnities(0);
    getTickets()
  }, []);
  
  useEffect(() => {

    // Cleanup on component unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("LeiloesDisponiveis")}
          />
              <Card className="p-3">
              <CardTitle>Lista de leilões</CardTitle>
                

                  <TableContainer
                    columns={columns}
                    data={data}
                    isGlobalFilter={false}
                    isAddOptions={false}
                    customPageSize={10}
                    className="custom-header-css"
                />
              </Card>
          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(LeiloesDisponiveis);
