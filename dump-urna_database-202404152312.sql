-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: urna_database
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis` (
  `user_id` int(11) NOT NULL,
  `perfis` int(11) DEFAULT NULL,
  KEY `FKsobr8hl9guwr8775lyl1mncg2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (10,2),(2,1),(2,2),(11,2);
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_images`
--

DROP TABLE IF EXISTS `produto_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produto_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `produto_id` (`produto_id`),
  CONSTRAINT `produto_images_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_images`
--

LOCK TABLES `produto_images` WRITE;
/*!40000 ALTER TABLE `produto_images` DISABLE KEYS */;
INSERT INTO `produto_images` VALUES (10,15,'cpf_frente.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\14522025092023_cpf_frente.png'),(11,16,'cpf_verso.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\15522025092023_cpf_verso.png'),(12,17,'diploma_frente.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\15522025092023_diploma_frente.png'),(13,18,'foto.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\17541328092023_foto.jpg'),(14,19,'rg_frente.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\17541328092023_rg_frente.png'),(15,20,'rg_verso.png','C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\static\\image\\17541328092023_rg_verso.png');
/*!40000 ALTER TABLE `produto_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sala_id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `data_insercao` datetime NOT NULL,
  `preco_minimo` float NOT NULL,
  `vendido` int(11) DEFAULT '0',
  `preco_vendido` float DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `sala_id` (`sala_id`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`sala_id`) REFERENCES `salas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (15,71,'moto1','2023-09-25 20:52:15',101,NULL,NULL,'nao tem especificação',NULL),(16,71,'moto2','2023-09-25 20:52:15',101.5,NULL,NULL,'nao tem especificação',NULL),(17,71,'moto3','2023-09-25 20:52:15',999.98,NULL,NULL,'nao tem especificação',NULL),(18,72,'ford1','2023-09-28 13:54:18',100,1,100,'ford descricao',2),(19,72,'ford2','2023-09-28 13:54:18',100,1,160,'ford descricao2',2),(20,72,'ford3','2023-09-28 13:54:18',100,1,180,'ford descricao3',3);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salas`
--

DROP TABLE IF EXISTS `salas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_abertura` datetime NOT NULL,
  `data_fechamento` datetime NOT NULL,
  `nmax` int(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ncurrent` int(11) DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'inicio',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `salas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salas`
--

LOCK TABLES `salas` WRITE;
/*!40000 ALTER TABLE `salas` DISABLE KEYS */;
INSERT INTO `salas` VALUES (71,'7441c041-5e30-4f7c-98d6-c6c9e39b3496','sala de moto','aqui tem o leilão de motos','2023-09-25 20:52:15','2023-09-25 20:50:00','2023-09-25 21:51:00',6,2,2,'inicio'),(72,'e685b3f8-5c62-46a1-9272-21d560c122cc','sala de carro','aqui tem o leilão de carro','2023-09-28 13:54:17','2023-10-05 09:05:00','2023-10-03 14:53:00',10,2,21,'final');
/*!40000 ALTER TABLE `salas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `evento` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `hashsocket` varchar(255) DEFAULT NULL,
  `session` varchar(100) DEFAULT NULL,
  `session_ev` varchar(100) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `dinheiro` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cmxo70m08n43599l3h0h07cc6` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'nelio.iftm@gmail.com','Nelio castro','$2a$10$THKOEI7Au31zQOWfaTkFbudKxEIKQlkBoTFvOJAjk6oZrvBN.Irpm',NULL,NULL,NULL,1,540.78),(3,'ldjmoreira@hotmail.com','Lorion','$2a$10$THKOEI7Au31zQOWfaTkFbudKxEIKQlkBoTFvOJAjk6oZrvBN.Irpm',NULL,NULL,NULL,1,880.78),(10,'lucas@mail.com','lucas','$2a$10$4hHyCn/Iwk0.k5iLqdE6/e5mS7D3OsKTqyNuCrk7IDat.a5d.EJly',NULL,NULL,NULL,0,1000.75),(11,'lucas2@gmail.com','lucas2','$2a$10$QA01hqDNAV8QcQKdyDiiX.ZQvEhFPSoc.3NaBYIoTzYSABz.Kzsye',NULL,NULL,NULL,0,1000);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'urna_database'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-15 23:12:12
