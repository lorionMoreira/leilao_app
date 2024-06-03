
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `hashsocket` varchar(255) DEFAULT NULL,
  `session` varchar(100) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cmxo70m08n43599l3h0h07cc6` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

INSERT INTO `users` VALUES 
    (10,'lucas@mail.com','lucas','$2a$10$4hHyCn/Iwk0.k5iLqdE6/e5mS7D3OsKTqyNuCrk7IDat.a5d.EJly',0),
    (2,'nelio.iftm@gmail.com','Nelio castro','$2a$10$THKOEI7Au31zQOWfaTkFbudKxEIKQlkBoTFvOJAjk6oZrvBN.Irpm',1),
    (3,'ldjmoreira@hotmail.com','Lorion','$2a$10$HdidT5gJFJct6uC.HxxK0uPojyrC1CwMrmNHZw62jdS2fGdX9B3sW',1),
    (11,'lucas2@gmail.com','lucas2','$2a$10$QA01hqDNAV8QcQKdyDiiX.ZQvEhFPSoc.3NaBYIoTzYSABz.Kzsye',0);

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `evento` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfis` (
  `user_id` int(11) NOT NULL,
  `perfis` int(11) DEFAULT NULL,
  KEY `FKsobr8hl9guwr8775lyl1mncg2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (10,2),(2,1),(2,2),(11,2);
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;


DROP TABLE IF EXISTS `salas`;

CREATE TABLE `salas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_abertura` datetime NOT NULL,
  `data_fechamento` datetime NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` varchar(255) ,
  `ativa` tinyint(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sala_id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `data_insercao` datetime NOT NULL,
  `preco_minimo` float NOT NULL,
  `vendido` int(11) NOT NULL,
  `preco_vendido` float NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `url_imagem` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sala_id) REFERENCES salas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE produto_images (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `produto_id` INT,
    `image_name` VARCHAR(255),
    `image_path` VARCHAR(255),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);