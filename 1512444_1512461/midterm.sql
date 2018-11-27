-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: midterm
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `requestevent`
--

DROP TABLE IF EXISTS `requestevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `requestevent` (
  `id_request` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `note` varchar(150) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `iduser` int(11) DEFAULT NULL,
  `idreceiver` int(11) DEFAULT NULL,
  `addressReverse` varchar(150) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `lng` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_request`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requestevent`
--

LOCK TABLES `requestevent` WRITE;
/*!40000 ALTER TABLE `requestevent` DISABLE KEYS */;
INSERT INTO `requestevent` VALUES (24,'Nguyen an son','1232121','9 Lê Văn chí','sdasdasdasdsa',1,'2018-11-12 20:32:15',NULL,NULL,NULL,NULL,NULL),(25,'Nguyen an son','1232121','9 Lê Văn chí','sdasdasdasdsa',0,'2018-11-12 20:35:18',3,NULL,NULL,NULL,NULL),(26,'Nguyen an son','','9 Lê Văn chí','',1,'2018-11-12 21:05:40',NULL,NULL,NULL,NULL,NULL),(27,'Hoàng Anh Quốc','01111','257 Nguyễn Văn Cừ Quận 5','aaaaa',0,'2018-11-14 08:50:49',3,NULL,NULL,NULL,NULL),(29,'Khoa học tư  nhiên','0123456789','86 Nguyễn Trường Tộ  Tp.Vũng Tàu','Đi chơi',1,'2018-11-20 23:38:40',NULL,5,'25 Đường Tân Thọ, Phường 8, Tân Bình, Hồ Chí Minh, Vietnam','10.787055627126465','106.6525227211182');
/*!40000 ALTER TABLE `requestevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrefreshtokenext`
--

DROP TABLE IF EXISTS `userrefreshtokenext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userrefreshtokenext` (
  `iduser` int(11) NOT NULL,
  `rf_token` varchar(100) DEFAULT NULL,
  `change_time` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrefreshtokenext`
--

LOCK TABLES `userrefreshtokenext` WRITE;
/*!40000 ALTER TABLE `userrefreshtokenext` DISABLE KEYS */;
INSERT INTO `userrefreshtokenext` VALUES (3,'CwhY7h51UxzHRncwhFoXTgDUf5buypm0UxMjwFntHZWokFgAupE6szVUgpC3dXL0C2hpbUqViih4HqYu','2018-11-25 10:20:53'),(4,'RNWN4jx5PGApctDWi43Hctr3NkXDgGrrEAAC3uxB53MJprN1PyN69z95tynATCcy28hjtT8kzougRFOj','2018-11-25 09:19:32'),(5,'ZqZZ73KohUctfAsoyiSMFemhjZ5xf1Ut289wlGUEvgpyJ1nLGbanf9xQyOh4kHZ2uXpc6t69cF6851mF','2018-11-25 09:00:55'),(6,'c1vpxUiDiCgaGECYMRN9BxGeng7HATNVwiKlyfkWc4D2mtQJF5gAqqJvS4HRkkLJCFPUohbCu8d1xbc0','2018-11-25 16:09:35');
/*!40000 ALTER TABLE `userrefreshtokenext` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `DOB` datetime DEFAULT NULL,
  `permission` tinyint(4) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `lng` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'admin','21232f297a57a5a743894a0e4a801fc3','admin','admin@gmail.com','2018-11-16 00:00:00',1,'0123456789',NULL,NULL,NULL),(5,'receiver','c4ca4238a0b923820dcc509a6f75849b','receiver','receiver@gmail.com','2018-11-20 00:00:00',2,'0321654987',NULL,NULL,NULL),(6,'username','5f4dcc3b5aa765d61d8327deb882cf99','user name','name@gmail.com','2018-11-25 00:00:00',0,'0328010342','0',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-25 16:10:44
