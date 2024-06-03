import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { isEmpty, map } from "lodash";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { del, get, post, put,setAuthToken  } from "../../helpers/api_helper";
import moment from "moment";
import styles from "./style.module.css";
import {
  Button,
  Card,
  Col,
  Container,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";

import produtoImage from "../../assets/images/Imagem4.png";

import produtoImage2 from "../../assets/images/megamenu-img.png";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import avatar1 from "../../assets/images/users/avatar-1.jpg";

import {
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
} from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

var stompClient =null;

const Chat = () => {

  //meta title
  document.title = "Chat | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();
  const { uuid } = useParams();

  const { chats, groups, contacts,demoData} = useSelector(state => ({
    chats: state.chat.chats,
    groups: state.chat.groups,
    contacts: state.chat.contacts,
    demoData: state.Login.demoData,
  }));


  const [messageBox, setMessageBox] = useState(null);
  // const Chat_Box_Username2 = "Henry Wells"
  const [currentRoomId, setCurrentRoomId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState({
    name: null,  // Set an initial value for name
    isActive: true,
  });


  const [menu1, setMenu1] = useState(false);
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [other_Menu, setother_Menu] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [hash, setHash] = useState("1");
  const [Chat_Box_Username, setChat_Box_Username] = useState("Steven Franklin");
  // eslint-disable-next-line no-unused-vars
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("Active Now");
  const [curMessage, setcurMessage] = useState("");

  const [messages, setMessages] = useState([]); 
  const [photoURL, setPhotoURL] = useState(produtoImage);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [currentFecthProducts, setcurrentFecthProducts] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [manager,setManager] = useState('inicio');
  const [money,setMoney] = useState(0);
  const [lance,setLance] = useState(0);
  const [lanceManager,setLanceManager] = useState('inicio');
  const [buttonLance,setButtonLance] = useState(true);

  const [currentProductInformation, setCurrentProductInformation] = useState({
    id: 0,
    name: 'A carregar ...',
    minPrice: 0.00,
    description: 'A carregar ...'
  });

  const [currentSalaInformation, setCurrentSalaInformation] = useState({
    id: 0,
    nome: 'A carregar ...',
    descricao: 'A carregar ...',
    uuid: ''
  });
  useEffect(() => {

    // Cleanup on component unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    lanceManagerFunction()
    console.log("llmanager")
    console.log(lanceManager)
  }, [lanceManager]);

  const lanceManagerFunction = async () => {
    console.log('ativadooooooooooooooooooooooo2')
    switch (manager) {
      case 'inicio':

      break;

      case 'linicio':
        

      break;

      case 'pending':

      break;

      case 'lsecundario':

      break;

      case 'final':

      break;
    
      default:
        break;
    }
  }

  useEffect(() => {

    if (demoData && demoData.data && demoData.data.nome) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        name: demoData.data.nome
      }));

    }
  }, [demoData]);

  useEffect(() => {
    if (uuid) {
      setCurrentRoomId(uuid);
    }
  }, [uuid]);

  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getTickets()
    getMoney()
    getRoomState()
  }, []);

  useEffect(() => {
    managerFunction()
    console.log("manager")
    console.log(manager)
  }, [manager]);

  useEffect(() => {
    //console.log("recebimento");
    //console.log(countdown)

    //console.log(currentFecthProducts)
    //console.log(numberOfProducts)
    if(countdown == 0){
      setLance(0)
      setButtonLance(true);
      getMoney()
      if(currentFecthProducts == numberOfProducts){
        setManager('final');
      }else{
        setTimeout(() => {
          setManager('second');
        }, 2000);
      }

    }
  }, [countdown]);

  /************************************/
  const managerFunction = async () => {
    console.log('ativadooooooooooooooooooooooo')
    switch (manager) {
      case 'inicio':

      break;

      case 'first':
        await getRoomInfomation();
       let idResponse = await getProdutosBySalaUuid();
        console.log('again???')
        handleCountdown(idResponse);
        
        console.log('again???')
      break;

      case 'pending':

      break;

      case 'second':
        await getRoomInfomation();// productcount
        let idResponse2 = await getProdutosBySalaUuid();// enviar currentfetchprodcut seta currentfetchprodcut+1
        handleCountdown(idResponse2);
        console.log('again???')
      break;

      case 'final':
        handleCountdown();
        setPhotoURL(produtoImage2)
      break;
    
      default:
        break;
    }
  }
  /***********************************/
  const getMoney = async () => {
    try {

      const response = await get('/api/clientes/getmoney');
     
      console.log("money")
      console.log(response)
      setMoney(response)
    } catch (error) {
      console.log(error)
    }
  };

  const getRoomState = async () => {
    try {

      const response = await get(`/api/salas/getbyuuid/${uuid}`);
      console.log("response0")
      console.log(response)
      setManager(response.estado);

    } catch (error) {
      console.log(error)
    }
  };
  
  const getTickets = async () => {
    try {

      const response = await get('/api/clientes/generateHash');
     
      setHash(response)
      connect(response);
    } catch (error) {
      console.log(error)
    }
  };
  const connect =(response)=>{

    //let Sock = new SockJS(`http://localhost:8080/websocket?token=${response}&uuid=${uuid}`);

    let Sock = new SockJS(`http://localhost:8080/websocket?token=${response}`);
    stompClient = over(Sock);
    stompClient.connect({uuid: uuid},onConnected, onError);
  }

  const onConnected = () => {
    //get
    console.log('Connected to WebSocket');
    //send
  
    stompClient.send('/app/BeLeilaoPart', {}, JSON.stringify({uuid: uuid}));// vem daqui

    //stompClient.send("/app/chat.register",{},JSON.stringify({sender: username, type: 'JOIN'}))

    //stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.subscribe('/user/'+uuid+'/private', onMessageReceived);
    stompClient.subscribe('/user/'+uuid+'/server', onMessageReceived);
    stompClient.subscribe('/topic/countdown/'+uuid, onCountDownReceived);
  }

  function onCountDownReceived(payload) {
    var message = JSON.parse(payload.body);
    setCountdown(message)

    
  }

  const onError = (error) => {
    console.error('Error connecting to WebSocket2:', error);
  };
  // const toggleNotification = () => {
  //   setnotification_Menu(!notification_Menu)
  // }

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };



  function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log("recebimento");
    console.log(message)
    if(message.type === 'JOIN') {
      /*
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
      */
    } else if (message.type === 'LEAVE') {
      /*
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
      */
    } else if (message.type === 'CHAT') {
      setMessages(prevMessages => [...prevMessages, message]);
    } else if (message.type === 'SERVICE1'){
      setMessages(prevMessages => [...prevMessages, message]);
      setManager('first');
    }else if (message.type === 'linicio'){
      setLanceManager('linicio');
      setLance(message.precoAtual)
      setButtonLance(false);
      setMessages(prevMessages => [...prevMessages, message]);

    }else if (message.type === 'lsecundario') {
      setLanceManager('lsecundario');
      setLance(message.precoAtual)
      setMessages(prevMessages => [...prevMessages, message]);
    }else {
      // implement error
    }

  }
 
  const getRoomInfomation = async () => {
    try {
      const response = await get(`/api/produtos/information/${uuid}`);

      console.log("response1")
      console.log(response.productCount)
      setNumberOfProducts(response.productCount)
    } catch (error) {
      console.log(error);

    }
  }
  const getAllVariable = () => {
    console.log(numberOfProducts)
    console.log(currentFecthProducts)
  }


  const getProdutosBySalaUuid = async () => {

    try {
      const response = await get(`/api/produtos/getbysalauuid/${uuid}/${currentFecthProducts}`);

      console.log("response2")
      console.log(response)

      setCurrentSalaInformation({
        id: response.sala.id,
        nome: response.sala.nome,
        descricao: response.sala.descricao,
        uuid: response.sala.uuid
      });

      setCurrentProductInformation({
        id: response.id,
        name: response.nome,
        minPrice: response.precoMinimo,
        currentPrice: response.precoVendido,
        description: response.descricao
      });

      setcurrentFecthProducts(currentFecthProducts+1)
      getPhotoOfProduct(response.id)

      return response.id;

    } catch (error) {
      console.log(error);

    }
  }

  const getPhotoOfProduct = async (productId) => {
    try {
      const response = await get(`/api/produtoimages/getphoto/${productId}`, {
        responseType: 'arraybuffer' // Specify responseType as 'arraybuffer' to receive binary data
      });
      console.log("response3")
      console.log(response)
      // Create a Blob from the array buffer
      const blob = new Blob([response], { type: 'image/jpeg' });
  
      // Create a URL for the blob
      const photoURL = URL.createObjectURL(blob);
      console.log(photoURL)
      setPhotoURL(photoURL)

    } catch (error) {
      console.error('Error fetching photo:', error);
    }
  };


  function onMessageReceivedFromServer(payload) {
    var message = JSON.parse(payload.body);

  }

  const lanceInicial = async () => {

    if ( money <= currentProductInformation.minPrice){
      alert('Você não tem dinheiro suficiente para pagar o lance inicial')
    }

    try {

      const response = await post(`/api/produtos/lanceinicial`, {
        salaRoom: currentSalaInformation.uuid,
        produtoId: currentProductInformation.id
      });

      
      //setLance(currentProductInformation.minPrice)

      console.log('lance incial');
      console.log(response)


    } catch (error) {
      console.error('Error fetching lance inicial:', error);
    }
  };

  const cobrirLance = async () => {

    
    if ( money <= currentProductInformation.minPrice){
      alert('Você não tem dinheiro suficiente para cobrir o lance')
    }

    let novolance = lance+20;

    if ( money <= novolance){
      alert('Você não tem dinheiro suficiente para cobrir o lance')
    }
    try {

      const response = await post(`/api/produtos/cobrirlance`, {
        salaRoom: currentSalaInformation.uuid,
        produtoId: currentProductInformation.id,
        novolance: novolance
      });

      
      //setLance(currentProductInformation.minPrice)

      console.log('lance incial');
      console.log(response)


    } catch (error) {
      console.error('Error fetching lance inicial:', error);
    }
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId) => {
    setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    dispatch(onGetMessages(roomId));
  };
  
  const handleCountdown = async (idResponse = 0) => {
    stompClient.send('/app/startcountdown', {}, JSON.stringify({uuid: uuid,manager: manager,produtoId: idResponse}));
    setManager('pending')
    console.log('givent')
  }

  const handleMore30 = async () => {
    stompClient.send('/app/handlemore30', {}, JSON.stringify({uuid: uuid}));
    console.log('givent30')
  }

  const addMessage = async (roomId, sender) => {

    const message = {
      id: Date.now(),
      roomId,
      sender,
      message: curMessage,
      type: "CHAT",
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setcurMessage("");
    console.log("envio");
    console.log(message);
    //dispatch(onAddMessage(message));
    stompClient.send("/app/chat.send2",{},JSON.stringify(message))
  };
 /*feio*/
  const scrollToBottom = () => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  };

  const onKeyPress = e => {
    const { key, value } = e;
    if (key === "Enter") {
      console.log(value)
      setcurMessage(value);
      addMessage(currentRoomId, currentUser.name);
    }
  };



  const [deleteMsg, setDeleteMsg] = useState("");
  const toggle_deleMsg = (ele) => {
    setDeleteMsg(!deleteMsg);
    ele.closest("li").remove();
  };

  const copyMsg = (ele) => {
    var copyText = ele.closest(".conversation-list").querySelector("p").innerHTML;
    navigator.clipboard.writeText(copyText);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">Sala {currentSalaInformation.id}: {currentSalaInformation.nome}</CardTitle>
                  <CardText>
                        {currentSalaInformation.descricao}
                    </CardText>
                  <div className="hstack gap-3">
                  </div>
                </CardBody>              
              </Card>             
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div className="d-lg-flex justify-content-end">
                <div className={`${styles['margin-left-lor']}`}>
                  <Card className="" style={{ marginBottoms: "0px" }}>
                    <div className={`${styles['image-container']}`}>
                    <div className={styles['top-left-number']}>{currentFecthProducts}</div>
                      <CardImg top className={`${styles.cardImgChat}`}src={photoURL} alt="Skote" />
                    </div>
                    <CardBody>
                      <CardText className="mt-0">
                        <b>Produto: </b> {currentProductInformation.name}
                      </CardText>
                      <CardText>
                        <b>Descrição:</b>  {currentProductInformation.description}
                      </CardText>
                      <CardText> <li className="list-group-item">
                        <b>Sessão acaba em: </b>{countdown} s</li>
                      </CardText>
                      <CardText>  
                          <li className="list-group-item"><b>Preço mínimo:</b> R$:{currentProductInformation.minPrice}</li>
                      </CardText>
                    </CardBody>
                    <ul className="list-group list-group-flush">
                      <li style={{ padding: "0px" }} className="list-group-item"></li>
                      <li style={{ padding: "0px" }}  className="list-group-item"></li>
                    </ul>

                    <CardBody>
                      <div className="d-flex">

                        <Button
                          color="primary"
                          className="btn btn-primary waves-effect waves-light me-2"
                          onClick={() => {lanceInicial() }}
                          disabled={!buttonLance}
                        >
                          Pagar Lance incial
                        </Button>

                        <Button
                          color="primary"
                          className="btn btn-primary waves-effect waves-light me-2"
                          onClick={() => {cobrirLance() }}
                          disabled={buttonLance}
                        >
                          Adicionar R$ 20,00
                        </Button>



                      </div>          
                    </CardBody>
                  </Card>
                </div>
                <div className="w-50 user-chat">
                  <Card>
                    <div className="p-4 border-bottom ">
                      <Row>
                        <Col md="4" xs="9">
                          <h5 className="font-size-15 mb-1">
                            {Chat_Box_Username} numero pessoas
                          </h5>

                          <p className="text-muted mb-0">
                            <i
                              className={
                                Chat_Box_User_Status === "Active Now"
                                  ? "mdi mdi-circle text-success align-middle me-2"
                                  : Chat_Box_User_Status === "intermediate"
                                    ? "mdi mdi-circle text-warning align-middle me-1"
                                    : "mdi mdi-circle align-middle me-1"
                              }
                            />
                            {Chat_Box_User_Status}
                          </p>
                        </Col>
                        <Col md="8" xs="3">
                          <ul className="list-inline user-chat-nav text-end mb-0">
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                             className="me-1"
                                isOpen={search_Menu}
                                toggle={toggleSearch}
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-search-alt-2" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-md"
                                >
                                  <Form className="p-3">
                                    <FormGroup className="m-0">
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search ..."
                                          aria-label="Recipient's username"
                                        />
                                        {/* <InputGroupAddon addonType="append"> */}
                                        <Button color="primary" type="submit">
                                          <i className="mdi mdi-magnify" />
                                        </Button>
                                        {/* </InputGroupAddon> */}
                                      </InputGroup>
                                    </FormGroup>
                                  </Form>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                                isOpen={settings_Menu}
                                toggle={toggleSettings}
                                className="me-1"
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-cog" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem href="#">
                                    View Profile
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Clear chat
                                  </DropdownItem>
                                  <DropdownItem href="#">Muted</DropdownItem>
                                  <DropdownItem href="#">Delete</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item">
                              <Dropdown
                                isOpen={other_Menu}
                                toggle={toggleOther}                                
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-dots-horizontal-rounded" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                  <DropdownItem href="#">Action</DropdownItem>
                                  <DropdownItem href="#">
                                    Another Action
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Something else
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <div className="chat-conversation p-3">
                        <ul className="list-unstyled">
                          <PerfectScrollbar
                            style={{ height: "470px" }}
                            containerRef={ref => setMessageBox(ref)}
                          >
                            <li>
                              <div className="chat-day-title">
                                <span className="title">Today</span>
                              </div>
                            </li>
                            {messages &&
                              map(messages, message => (
                                <li
                                  key={"test_k" + message.id}
                                  className={
                                    message.sender === currentUser.name
                                      ? "right"
                                      : ""
                                  }
                                >
                                  <div className="conversation-list">
                                    <UncontrolledDropdown>
                                      <DropdownToggle
                                        href="#"
                                        tag="a" className="dropdown-toggle"
                                      >
                                        <i className="bx bx-dots-vertical-rounded" />
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem onClick={(e) => copyMsg(e.target)} href="#">
                                          Copy
                                        </DropdownItem>
                                        <DropdownItem href="#">
                                          Save
                                        </DropdownItem>
                                        <DropdownItem href="#">
                                          Forward
                                        </DropdownItem>
                                        <DropdownItem onClick={(e) => toggle_deleMsg(e.target)} href="#">
                                          Delete
                                        </DropdownItem>
                                        
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <div className="ctext-wrap">
                                      <div className="conversation-name">
                                        {message.sender}
                                      </div>
                                      <p>{message.message}</p>
                                      <p className="chat-time mb-0"><i className="bx bx-time-five align-middle me-1"></i> {message.time}</p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                          </PerfectScrollbar>
                        </ul>
                      </div>
                      <div className="p-3 chat-input-section">
                        <Row>
                          <Col>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={curMessage}
                                onKeyPress={onKeyPress}
                                onChange={e => setcurMessage(e.target.value)}
                                className={`${styles.chatInputNew} form-control chat-input`}
                                placeholder="Enter Message..."
                              />

                            </div>
                          </Col>
                          <Col className="col-auto">
                            <Button
                              type="button"
                              color="primary"
                              onClick={() =>
                                addMessage(currentRoomId, currentUser.name)
                              }
                              className="btn btn-primary btn-rounded chat-send w-md "
                            >
                              <span className="d-none d-sm-inline-block me-2">
                                Send
                              </span>{" "}
                              <i className="mdi mdi-send" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">Minhas informações</CardTitle>
                  <div>Dinheiro em caixa: (R$) {money} </div>
                    <div className="hstack gap-3">
                  </div>
                   { lance !== 0 ?
                      <div className={styles.lanceDado}>Lance atual de: (R$) {lance} </div> : null
                   }
                 

                </CardBody>
            
              </Card>  
                    <Button
                      color="primary"
                      className="btn btn-primary waves-effect waves-light me-2"
                      onClick={() => {setManager('first')}}
                    >
                      teste inicio
                    </Button>

                    <Button
                      color="primary"
                      className="btn btn-primary waves-effect waves-light me-2"
                      onClick={() => {handleMore30() }}
                    >
                      add 30
                    </Button>   
                    <div className="hstack gap-3">
                          <Input className="form-control me-auto" type="text" placeholder="Cobrir lance jogado"
                            aria-label="Cobrir lance jogado"/>
                            <button onClick={() => {getAllVariable() }} type="button" className="btn btn-secondary">Submit</button>
                    </div>         
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
};

export default Chat;
