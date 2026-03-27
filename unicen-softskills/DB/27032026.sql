-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: unicen_softskills
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `col_competencia`
--

DROP TABLE IF EXISTS `col_competencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `col_competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `col_competencia`
--

LOCK TABLES `col_competencia` WRITE;
/*!40000 ALTER TABLE `col_competencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `col_competencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `col_curso`
--

DROP TABLE IF EXISTS `col_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `col_curso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `col_curso`
--

LOCK TABLES `col_curso` WRITE;
/*!40000 ALTER TABLE `col_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `col_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competencia`
--

DROP TABLE IF EXISTS `competencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competencia`
--

LOCK TABLES `competencia` WRITE;
/*!40000 ALTER TABLE `competencia` DISABLE KEYS */;
INSERT INTO `competencia` VALUES (1,'Gestión del tiempo',NULL,1,'2026-02-28 09:09:15'),(2,'Pensamiento crítico',NULL,1,'2026-02-28 09:09:15'),(3,'Inteligencia emocional',NULL,1,'2026-02-28 09:09:15'),(4,'Trabajo en equipo',NULL,1,'2026-02-28 09:09:15'),(5,'Comunicación',NULL,1,'2026-02-28 09:09:15');
/*!40000 ALTER TABLE `competencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(160) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Taller de Empleabilidad','COL-EMP-01',1,'2026-02-28 09:09:15'),(2,'Comunicación Efectiva','COL-COM-01',1,'2026-02-28 09:09:15'),(3,'Liderazgo','COL-LID-01',1,'2026-02-28 09:09:15');
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico_intento`
--

DROP TABLE IF EXISTS `diagnostico_intento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico_intento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` int(11) NOT NULL,
  `estudiante_nombre` varchar(150) NOT NULL,
  `carrera` varchar(120) NOT NULL,
  `semestre` enum('4','7') NOT NULL,
  `fecha_aplicacion` date NOT NULL,
  `total_puntaje` int(11) NOT NULL DEFAULT 0,
  `nivel` enum('BASICO','FUNCIONAL','AVANZADO') DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_int_test` (`test_id`),
  KEY `idx_intento_usuario` (`usuario_id`),
  CONSTRAINT `fk_int_test` FOREIGN KEY (`test_id`) REFERENCES `diagnostico_test` (`id`),
  CONSTRAINT `fk_intento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico_intento`
--

LOCK TABLES `diagnostico_intento` WRITE;
/*!40000 ALTER TABLE `diagnostico_intento` DISABLE KEYS */;
INSERT INTO `diagnostico_intento` VALUES (1,2,'carlos','sistemas','4','2026-02-28',70,'AVANZADO','2026-02-28 08:07:49',NULL),(2,2,'cas','ddd','7','2026-02-28',68,'AVANZADO','2026-02-28 08:08:44',NULL),(3,2,'caasd','asdasd','4','2026-02-28',65,'AVANZADO','2026-02-28 08:28:38',NULL),(4,3,'Carlos Azcarraga Esquivel','IA','4','2026-03-01',60,'FUNCIONAL','2026-03-01 19:52:25',NULL),(5,2,'Carlos Azcarraga Esquivel','IA','7','2026-03-01',74,'AVANZADO','2026-03-01 19:53:40',NULL),(6,2,'prueba','sistemas','4','2026-03-07',73,'AVANZADO','2026-03-07 09:17:11',NULL),(7,3,'prueba 2','sistemas','4','2026-03-07',58,'FUNCIONAL','2026-03-07 09:34:47',NULL),(8,3,'Carlos Azcarraga','sistemas','4','2026-03-07',61,'FUNCIONAL','2026-03-07 09:41:52',NULL),(9,3,'Carlos Azcarraga','comercial','4','2026-03-07',65,'AVANZADO','2026-03-07 09:46:45',NULL),(10,2,'Carlos Azcarraga','ia','4','2026-03-07',74,'AVANZADO','2026-03-07 09:51:26',NULL),(11,3,'Carlos Azcarraga','vicerectorado','4','2026-03-07',61,'FUNCIONAL','2026-03-07 13:23:36',NULL),(12,3,'Carlos Azcarraga','sistemas','4','2026-03-27',59,'FUNCIONAL','2026-03-27 12:55:11',NULL),(13,3,'Carlos Azcarraga','sistemas','4','2026-03-27',60,'FUNCIONAL','2026-03-27 13:03:00',NULL),(14,3,'Jaime Dunn','Innovación Digital e Inteligencia Artificial','4','2026-03-27',61,'FUNCIONAL','2026-03-27 13:26:05',NULL),(15,3,'Jaime Dunn','Innovación Digital e Inteligencia Artificial','4','2026-03-27',44,'FUNCIONAL','2026-03-27 13:26:59',NULL),(16,3,'Jaime Dunn','Contaduría Pública','4','2026-03-27',54,'FUNCIONAL','2026-03-27 13:39:25',NULL),(17,3,'Jaime Dunn','Contaduría Pública','4','2026-03-27',39,'BASICO','2026-03-27 13:53:59',4);
/*!40000 ALTER TABLE `diagnostico_intento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico_pregunta`
--

DROP TABLE IF EXISTS `diagnostico_pregunta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico_pregunta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `enunciado` text NOT NULL,
  `competencia` varchar(80) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `invertido` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_preg_test` (`test_id`),
  CONSTRAINT `fk_preg_test` FOREIGN KEY (`test_id`) REFERENCES `diagnostico_test` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico_pregunta`
--

LOCK TABLES `diagnostico_pregunta` WRITE;
/*!40000 ALTER TABLE `diagnostico_pregunta` DISABLE KEYS */;
INSERT INTO `diagnostico_pregunta` VALUES (1,2,1,'Cuando tengo varias obligaciones, priorizo considerando el impacto más que la urgencia.','Gestión del tiempo',1,0),(2,2,2,'Si una instrucción no es clara, continúo como creo correcto antes de pedir aclaración.','Pensamiento crítico',1,0),(3,2,3,'Cuando alguien reacciona mal conmigo, intento comprender la causa antes de responder.','Inteligencia emocional',1,0),(4,2,4,'En trabajos grupales, adapto mi forma de explicar según con quién estoy hablando.','Comunicación efectiva',1,0),(5,2,5,'Frente a un problema, empiezo a actuar incluso si no tengo toda la información.','Resolución de problemas',1,0),(6,2,6,'Si noto desorganización en un grupo, propongo una forma de ordenar el trabajo.','Liderazgo',1,0),(7,2,7,'Cuando un compañero no cumple su parte, prefiero avanzar solo para no retrasarme.','Trabajo en equipo',1,0),(8,2,8,'Suelo comenzar las tareas importantes, aunque no tenga presión inmediata.','Gestión del tiempo',1,0),(9,2,9,'En situaciones tensas, mi estado emocional suele notarse en mi forma de hablar.','Inteligencia emocional',1,0),(10,2,10,'En equipos diversos, modifico mi forma de trabajar para facilitar el avance del grupo.','Trabajo en equipo',1,0),(11,2,11,'Cuando doy una opinión, trato de ser directo sin herir a los demás.','Adaptabilidad y flexibilidad',1,0),(12,2,12,'Cuando no sé hacer algo, busco aprenderlo antes de pedir ayuda.','Pensamiento crítico',1,0),(13,2,13,'Si un plan no funciona, propongo alternativas en vez de quedarme en la queja.','Participación / Asertividad',1,0),(14,2,14,'Me siento cómodo colaborando con personas que piensan muy diferente a mí.','Resolución de problemas',1,0),(15,2,15,'Cuando tengo varias tareas, uso algún método para organizar mi tiempo y cumplir.','Aprendizaje / Observación',1,0),(16,2,16,'Si debo comunicar algo complejo, preparo primero mis ideas para ser claro.','Responsabilidad y ética',1,0),(17,2,17,'Ante desacuerdos, suelo centrarme más en la tarea que en quién tiene la razón.','Trabajo en equipo',1,0),(18,2,18,'Después de cometer un error, continúo con mis tareas sin quedarme enganchado en la frustración.','Inteligencia emocional',1,0),(19,2,19,'Cuando el grupo se desmotiva, busco mantener el enfoque en el objetivo.','Liderazgo',1,0),(20,2,20,'Suelo ajustar mis planes cuando aparecen imprevistos sin abandonar el objetivo principal.','Adaptabilidad y flexibilidad',1,0),(21,2,21,'Cuando tengo una idea diferente a la del grupo, espero a que otros hablen antes de intervenir.','Participación / Asertividad',1,0),(22,3,1,'Cuando tengo varias obligaciones, priorizo considerando el impacto más que la urgencia.','Gestión de Tiempo y Responsabilidad',1,0),(23,3,2,'Si una instrucción no es clara, continúo como creo correcto antes de pedir aclaración.','Comunicación',1,1),(24,3,3,'Cuando alguien reacciona mal conmigo, intento comprender la causa antes de responder.','Gestión Socioemocional',1,0),(25,3,4,'En trabajos grupales, adapto mi forma de explicar según con quién estoy hablando.','Comunicación',1,0),(26,3,5,'Frente a un problema, empiezo a actuar incluso si no tengo toda la información.','Resolución de Problemas y Pensamiento Crítico',1,1),(27,3,6,'Si noto desorganización en un grupo, propongo una forma de ordenar el trabajo.','Liderazgo e Iniciativa',1,0),(28,3,7,'Cuando un compañero no cumple su parte, prefiero avanzar solo para no retrasarme.','Trabajo en Equipo',1,1),(29,3,8,'Suelo comenzar las tareas importantes, aunque no tenga presión inmediata.','Gestión de Tiempo y Responsabilidad',1,0),(30,3,9,'En situaciones tensas, mi estado emocional suele notarse en mi forma de hablar.','Gestión Socioemocional',1,1),(31,3,10,'En equipos diversos, modifico mi forma de trabajar para facilitar el avance del grupo.','Trabajo en Equipo',1,0),(32,3,11,'Si cambian las condiciones de una tarea a último momento, necesito tiempo para volver a concentrarme.','Adaptabilidad',1,1),(33,3,12,'Antes de tomar una decisión, considero cómo puede afectar a otras personas involucradas.','Resolución de Problemas y Pensamiento Crítico',1,0),(34,3,13,'Prefiero que otros tomen decisiones importantes para evitar conflictos.','Liderazgo e Iniciativa',1,1),(35,3,14,'Cuando una solución no funciona, cambio de estrategia sin insistir en lo mismo.','Resolución de Problemas y Pensamiento Crítico',1,0),(36,3,15,'Cuando me asignan una tarea nueva, primero observo cómo otros la resuelven antes de actuar.','Adaptabilidad',1,0),(37,3,16,'Si no logro cumplir un plazo, informo antes de que se convierta en un problema mayor.','Gestión de Tiempo y Responsabilidad',1,0),(38,3,17,'Ante desacuerdos, suelo centrarme más en la tarea que en quién tiene la razón.','Trabajo en Equipo',1,0),(39,3,18,'Después de cometer un error, continúo con mis tareas sin quedarme enganchado en la frustración.','Gestión Socioemocional',1,0),(40,3,19,'Cuando el grupo se desmotiva, busco mantener el enfoque en el objetivo.','Liderazgo e Iniciativa',1,0),(41,3,20,'Suelo ajustar mis planes cuando aparecen imprevistos sin abandonar el objetivo principal.','Adaptabilidad',1,0),(42,3,21,'Cuando tengo una idea diferente a la del grupo, espero a que otros hablen antes de intervenir.','Comunicación',1,0);
/*!40000 ALTER TABLE `diagnostico_pregunta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico_respuesta`
--

DROP TABLE IF EXISTS `diagnostico_respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico_respuesta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `intento_id` int(11) NOT NULL,
  `pregunta_id` int(11) NOT NULL,
  `valor` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_intento_pregunta` (`intento_id`,`pregunta_id`),
  KEY `fk_resp_preg` (`pregunta_id`),
  CONSTRAINT `fk_resp_int` FOREIGN KEY (`intento_id`) REFERENCES `diagnostico_intento` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resp_preg` FOREIGN KEY (`pregunta_id`) REFERENCES `diagnostico_pregunta` (`id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`valor` between 1 and 4)
) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico_respuesta`
--

LOCK TABLES `diagnostico_respuesta` WRITE;
/*!40000 ALTER TABLE `diagnostico_respuesta` DISABLE KEYS */;
INSERT INTO `diagnostico_respuesta` VALUES (1,1,1,2),(2,1,2,3),(3,1,3,3),(4,1,4,3),(5,1,5,3),(6,1,6,3),(7,1,7,3),(8,1,8,3),(9,1,9,3),(10,1,10,4),(11,1,11,4),(12,1,12,4),(13,1,13,3),(14,1,14,4),(15,1,15,4),(16,1,16,3),(17,1,17,4),(18,1,18,4),(19,1,19,4),(20,1,20,3),(21,1,21,3),(22,2,1,2),(23,2,2,3),(24,2,3,3),(25,2,4,3),(26,2,5,3),(27,2,6,4),(28,2,7,3),(29,2,8,3),(30,2,9,4),(31,2,10,3),(32,2,11,3),(33,2,12,4),(34,2,13,3),(35,2,14,3),(36,2,15,4),(37,2,16,3),(38,2,17,4),(39,2,18,3),(40,2,19,4),(41,2,20,3),(42,2,21,3),(43,3,1,3),(44,3,2,3),(45,3,3,2),(46,3,4,3),(47,3,5,3),(48,3,6,3),(49,3,7,3),(50,3,8,3),(51,3,9,3),(52,3,10,3),(53,3,11,2),(54,3,12,3),(55,3,13,4),(56,3,14,3),(57,3,15,4),(58,3,16,3),(59,3,17,3),(60,3,18,4),(61,3,19,3),(62,3,20,4),(63,3,21,3),(64,4,22,4),(65,4,23,3),(66,4,24,4),(67,4,25,4),(68,4,26,4),(69,4,27,4),(70,4,28,4),(71,4,29,4),(72,4,30,4),(73,4,31,4),(74,4,32,3),(75,4,33,4),(76,4,34,4),(77,4,35,3),(78,4,36,2),(79,4,37,3),(80,4,38,3),(81,4,39,4),(82,4,40,3),(83,4,41,3),(84,4,42,3),(85,5,1,4),(86,5,2,4),(87,5,3,3),(88,5,4,4),(89,5,5,4),(90,5,6,4),(91,5,7,3),(92,5,8,4),(93,5,9,3),(94,5,10,3),(95,5,11,4),(96,5,12,3),(97,5,13,3),(98,5,14,3),(99,5,15,4),(100,5,16,3),(101,5,17,4),(102,5,18,3),(103,5,19,4),(104,5,20,3),(105,5,21,4),(106,6,1,2),(107,6,2,3),(108,6,3,3),(109,6,4,3),(110,6,5,3),(111,6,6,4),(112,6,7,4),(113,6,8,4),(114,6,9,4),(115,6,10,3),(116,6,11,4),(117,6,12,4),(118,6,13,3),(119,6,14,4),(120,6,15,3),(121,6,16,4),(122,6,17,4),(123,6,18,3),(124,6,19,4),(125,6,20,3),(126,6,21,4),(127,7,22,4),(128,7,23,4),(129,7,24,3),(130,7,25,3),(131,7,26,2),(132,7,27,3),(133,7,28,4),(134,7,29,3),(135,7,30,4),(136,7,31,3),(137,7,32,3),(138,7,33,4),(139,7,34,4),(140,7,35,3),(141,7,36,4),(142,7,37,3),(143,7,38,3),(144,7,39,3),(145,7,40,3),(146,7,41,3),(147,7,42,4),(148,8,22,4),(149,8,23,3),(150,8,24,3),(151,8,25,4),(152,8,26,4),(153,8,27,3),(154,8,28,4),(155,8,29,4),(156,8,30,3),(157,8,31,3),(158,8,32,4),(159,8,33,4),(160,8,34,3),(161,8,35,4),(162,8,36,3),(163,8,37,3),(164,8,38,4),(165,8,39,4),(166,8,40,3),(167,8,41,3),(168,8,42,3),(169,9,22,4),(170,9,23,3),(171,9,24,4),(172,9,25,4),(173,9,26,3),(174,9,27,3),(175,9,28,3),(176,9,29,3),(177,9,30,4),(178,9,31,4),(179,9,32,3),(180,9,33,4),(181,9,34,3),(182,9,35,3),(183,9,36,4),(184,9,37,4),(185,9,38,3),(186,9,39,4),(187,9,40,3),(188,9,41,4),(189,9,42,3),(190,10,1,4),(191,10,2,3),(192,10,3,4),(193,10,4,4),(194,10,5,4),(195,10,6,3),(196,10,7,3),(197,10,8,4),(198,10,9,3),(199,10,10,4),(200,10,11,4),(201,10,12,4),(202,10,13,3),(203,10,14,3),(204,10,15,3),(205,10,16,3),(206,10,17,4),(207,10,18,3),(208,10,19,4),(209,10,20,3),(210,10,21,4),(211,11,22,4),(212,11,23,3),(213,11,24,4),(214,11,25,3),(215,11,26,3),(216,11,27,4),(217,11,28,3),(218,11,29,3),(219,11,30,4),(220,11,31,3),(221,11,32,4),(222,11,33,4),(223,11,34,3),(224,11,35,3),(225,11,36,3),(226,11,37,3),(227,11,38,3),(228,11,39,4),(229,11,40,4),(230,11,41,3),(231,11,42,3),(232,12,22,3),(233,12,23,3),(234,12,24,4),(235,12,25,4),(236,12,26,3),(237,12,27,3),(238,12,28,3),(239,12,29,3),(240,12,30,4),(241,12,31,4),(242,12,32,3),(243,12,33,3),(244,12,34,4),(245,12,35,3),(246,12,36,2),(247,12,37,3),(248,12,38,4),(249,12,39,3),(250,12,40,3),(251,12,41,3),(252,12,42,4),(253,13,22,4),(254,13,23,4),(255,13,24,3),(256,13,25,4),(257,13,26,3),(258,13,27,4),(259,13,28,3),(260,13,29,3),(261,13,30,4),(262,13,31,3),(263,13,32,3),(264,13,33,4),(265,13,34,4),(266,13,35,3),(267,13,36,3),(268,13,37,4),(269,13,38,4),(270,13,39,3),(271,13,40,3),(272,13,41,3),(273,13,42,3),(274,14,22,4),(275,14,23,3),(276,14,24,3),(277,14,25,4),(278,14,26,4),(279,14,27,3),(280,14,28,3),(281,14,29,4),(282,14,30,3),(283,14,31,4),(284,14,32,4),(285,14,33,3),(286,14,34,4),(287,14,35,4),(288,14,36,4),(289,14,37,3),(290,14,38,3),(291,14,39,3),(292,14,40,4),(293,14,41,3),(294,14,42,3),(295,15,22,2),(296,15,23,1),(297,15,24,2),(298,15,25,1),(299,15,26,2),(300,15,27,1),(301,15,28,3),(302,15,29,1),(303,15,30,2),(304,15,31,2),(305,15,32,1),(306,15,33,2),(307,15,34,2),(308,15,35,1),(309,15,36,2),(310,15,37,2),(311,15,38,1),(312,15,39,2),(313,15,40,2),(314,15,41,2),(315,15,42,2),(316,16,22,2),(317,16,23,2),(318,16,24,3),(319,16,25,2),(320,16,26,2),(321,16,27,2),(322,16,28,2),(323,16,29,3),(324,16,30,2),(325,16,31,3),(326,16,32,2),(327,16,33,2),(328,16,34,2),(329,16,35,3),(330,16,36,2),(331,16,37,2),(332,16,38,2),(333,16,39,3),(334,16,40,2),(335,16,41,3),(336,16,42,2),(337,17,22,1),(338,17,23,1),(339,17,24,1),(340,17,25,1),(341,17,26,1),(342,17,27,1),(343,17,28,1),(344,17,29,1),(345,17,30,1),(346,17,31,1),(347,17,32,1),(348,17,33,1),(349,17,34,1),(350,17,35,1),(351,17,36,1),(352,17,37,1),(353,17,38,1),(354,17,39,1),(355,17,40,1),(356,17,41,1),(357,17,42,1);
/*!40000 ALTER TABLE `diagnostico_respuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico_test`
--

DROP TABLE IF EXISTS `diagnostico_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `version` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico_test`
--

LOCK TABLES `diagnostico_test` WRITE;
/*!40000 ALTER TABLE `diagnostico_test` DISABLE KEYS */;
INSERT INTO `diagnostico_test` VALUES (2,'TEST-DIAGNÓSTICO DE HABILIDADES COL-UNICEN','v1',0,'2026-02-28 07:30:01'),(3,'Test Diagnóstico HB COL-UNICEN (invertidas)','1.0',1,'2026-03-01 18:19:18');
/*!40000 ALTER TABLE `diagnostico_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matriz_curso_competencia`
--

DROP TABLE IF EXISTS `matriz_curso_competencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matriz_curso_competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `curso_id` int(11) NOT NULL,
  `competencia_id` int(11) NOT NULL,
  `peso` decimal(5,2) NOT NULL DEFAULT 0.00,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_matriz` (`curso_id`,`competencia_id`),
  KEY `fk_matriz_comp` (`competencia_id`),
  CONSTRAINT `fk_matriz_comp` FOREIGN KEY (`competencia_id`) REFERENCES `competencia` (`id`),
  CONSTRAINT `fk_matriz_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matriz_curso_competencia`
--

LOCK TABLES `matriz_curso_competencia` WRITE;
/*!40000 ALTER TABLE `matriz_curso_competencia` DISABLE KEYS */;
INSERT INTO `matriz_curso_competencia` VALUES (1,1,1,30.00,1,'2026-02-28 09:09:15'),(2,1,2,25.00,1,'2026-02-28 09:09:15'),(3,1,4,25.00,1,'2026-02-28 09:09:15'),(4,1,5,20.00,1,'2026-02-28 09:09:15');
/*!40000 ALTER TABLE `matriz_curso_competencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(120) NOT NULL,
  `apellidos` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` varchar(40) NOT NULL DEFAULT 'Estudiante',
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Carlos Andres','Azcarraga Esquivel','tasajos@gmail.com','$2b$10$4yY4eSzMWWAPcn1on4UkQOSC1etDU5x6yuAASc44VcgucFygyHkku','Gestor','Activo','2026-03-01 21:43:01'),(2,'Carlos Andres','Azcarraga','cazcarraga@chakuy.com','$2b$10$ZHf9D//gQ9Sy.p7E0nTNCe/XYnozE1Yl3xxNgj.kKqpFdcqDdkjbS','Administrador','Activo','2026-03-07 08:26:10'),(3,'Carlos','Azcarraga','estudiante@unicen.edu.bo','$2b$10$2c2Q0K5R0DYh0JFKfPdZJuJ35XUT2PBFaql5UkEFDwtoxlvJSgakS','Estudiante','Activo','2026-03-07 08:26:57'),(4,'Jaime','Dunn','jaime@unicen.edu.bo','$2b$10$t8Mrp7OFxwZWA3fPfjo8KOCQd1BqCm8Zu/CGXe4rcye3YbRusPrre','Estudiante','Activo','2026-03-27 13:20:29');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-27  9:58:16
