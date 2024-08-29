import React, {  useState,useMemo, useEffect  } from "react";
import {
  Container,
  Col,
  Row,
  CardImg,
  Card,
  CardTitle
} from "reactstrap";
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


const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

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

            <Link
              to={`/salas/editar/${row.original.id}`}
              className={`d-inline-block mx-2 `}
              style={{ fontSize: '24px'}}
            >
              <i className="bx bx-pencil"></i>
            </Link>

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


  const fetchUnities = async (page) => {
    try {
      setLoading(true);
      const response = await get(`/api/produtos/getbysalauuid2/${uuid}`, {});
      console.log('response');
      console.log(response);

      
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
      console.log('photoURLsObject')
      console.log(photoURLsObject[22])
      setPhotoURLs(photoURLsObject);
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
      console.log("response", response);
      
      // Create a Blob from the array buffer
      const blob = new Blob([response], { type: 'image/jpeg' });

      // Create a URL for the blob
      const photoURL = URL.createObjectURL(blob);
      console.log(photoURL);

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
  }, []);



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
                />

              </Card>
          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(SalasGerenciarEdit);
