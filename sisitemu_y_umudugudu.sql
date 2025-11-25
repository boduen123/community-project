-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2025 at 04:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sisitemu_y_umudugudu`
--

-- --------------------------------------------------------

--
-- Table structure for table `abagore_batwite`
--

CREATE TABLE `abagore_batwite` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `amezi_atwite` int(11) DEFAULT NULL,
  `asuzumwe_kuvuzi` enum('Yego','Oya') DEFAULT 'Oya',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abagore_batwite`
--

INSERT INTO `abagore_batwite` (`id`, `amazina`, `imyaka`, `nimero_ya_telephone`, `aderesi`, `amezi_atwite`, `asuzumwe_kuvuzi`, `created_at`) VALUES
(1, 'jane', 30, '0789575446', 'nyarugenge', 5, 'Yego', '2025-11-16 14:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `abakobwa_babyaye`
--

CREATE TABLE `abakobwa_babyaye` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `umwana_ufite_imyaka` int(11) DEFAULT NULL,
  `asubiye_mw_ishuri` enum('Yego','Oya') DEFAULT 'Oya',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abakobwa_babyaye`
--

INSERT INTO `abakobwa_babyaye` (`id`, `amazina`, `imyaka`, `aderesi`, `nimero_ya_telephone`, `umwana_ufite_imyaka`, `asubiye_mw_ishuri`, `created_at`) VALUES
(2, 'kevine', 18, 'karambi', '0788576289', 1, 'Oya', '2025-11-16 14:23:44');

-- --------------------------------------------------------

--
-- Table structure for table `abakoresha`
--

CREATE TABLE `abakoresha` (
  `umukoresha_id` int(11) NOT NULL,
  `izina_rikoresha` varchar(50) DEFAULT NULL,
  `ijambo_banga` varchar(255) DEFAULT NULL,
  `amazina_yose` varchar(100) DEFAULT NULL,
  `uruhare` enum('Admin','Umuyobozi','Isibo','Reba_Gusa') DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `abana`
--

CREATE TABLE `abana` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `umubyeyi_wa_mwana` varchar(100) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `aiga` enum('Yego','Oya') DEFAULT 'Yego',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abana`
--

INSERT INTO `abana` (`id`, `amazina`, `imyaka`, `igitsina`, `umubyeyi_wa_mwana`, `aderesi`, `aiga`, `created_at`) VALUES
(1, 'kariza eme ', 2, 'Gore', 'jack', 'karambi', 'Oya', '2025-11-16 12:31:43');

-- --------------------------------------------------------

--
-- Table structure for table `abana_barimwo_mirire_mibi`
--

CREATE TABLE `abana_barimwo_mirire_mibi` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `umubyeyi_wa_mwana` varchar(100) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `urwego_rw_imirire` enum('Bikabije','Bito','Bisanzwe') DEFAULT NULL,
  `afashijwe` enum('Yego','Oya') DEFAULT 'Oya',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abana_barimwo_mirire_mibi`
--

INSERT INTO `abana_barimwo_mirire_mibi` (`id`, `amazina`, `imyaka`, `igitsina`, `umubyeyi_wa_mwana`, `aderesi`, `urwego_rw_imirire`, `afashijwe`, `created_at`) VALUES
(1, 'kevin', 2, 'Gore', 'kamanzi eme', 'nyarugenge, mageragere,mataba', 'Bikabije', 'Oya', '2025-11-16 13:35:39');

-- --------------------------------------------------------

--
-- Table structure for table `abasheshe_akanguhe`
--

CREATE TABLE `abasheshe_akanguhe` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) NOT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `ukeneye_ubufasha` enum('Yego','Oya') DEFAULT 'Oya',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abasheshe_akanguhe`
--

INSERT INTO `abasheshe_akanguhe` (`id`, `amazina`, `imyaka`, `igitsina`, `nimero_ya_telephone`, `aderesi`, `ukeneye_ubufasha`, `created_at`) VALUES
(1, 'asiyeri', 67, 'Gabo', '0798835555', 'karambi', 'Yego', '2025-11-16 12:34:25');

-- --------------------------------------------------------

--
-- Table structure for table `abaturage`
--

CREATE TABLE `abaturage` (
  `umuturage_id` int(11) NOT NULL,
  `izina_ribanza` varchar(100) DEFAULT NULL,
  `izina_risoza` varchar(100) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `itariki_y_amavuko` date DEFAULT NULL,
  `indangamuntu` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `isibo_id` int(11) DEFAULT NULL,
  `urugo_id` int(11) DEFAULT NULL,
  `icyiciro_cy_ubudehe` enum('A','B','C','D','E') DEFAULT NULL,
  `aho_ari` enum('Ariho','Yimukiye_Ahandi','Yitabye_Imana') DEFAULT 'Ariho',
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abaturage`
--

INSERT INTO `abaturage` (`umuturage_id`, `izina_ribanza`, `izina_risoza`, `igitsina`, `itariki_y_amavuko`, `indangamuntu`, `telefone`, `isibo_id`, `urugo_id`, `icyiciro_cy_ubudehe`, `aho_ari`, `igihe_yanditswe`) VALUES
(6, 'RUCAMUBYUMA ', 'VINCENT', 'Gabo', '1955-12-31', '1195680028285091', '0788255270', NULL, NULL, 'A', 'Ariho', '2025-11-11 05:43:13'),
(14, 'boduen', 'niyonkuru', 'Gabo', '2025-11-09', '1195680028285093', '0788355366', NULL, NULL, 'A', 'Ariho', '2025-11-13 14:24:23');

-- --------------------------------------------------------

--
-- Table structure for table `abayobozi`
--

CREATE TABLE `abayobozi` (
  `umuyobozi_id` int(11) NOT NULL,
  `amazina_yose` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `inshingano` enum('Umukuru_w_Umudugudu','Ushinzwe_Imibereho','Umunyamabanga','Umuyobozi_w_Isibo') DEFAULT NULL,
  `itariki_yatangiye` date DEFAULT NULL,
  `itariki_yarangije` date DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abayobozi`
--

INSERT INTO `abayobozi` (`umuyobozi_id`, `amazina_yose`, `telefone`, `inshingano`, `itariki_yatangiye`, `itariki_yarangije`, `umudugudu`) VALUES
(8, 'ishimwe olive', '0792051387', 'Ushinzwe_Imibereho', '2025-11-10', '2025-11-10', 'karambi');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `description`, `file_name`, `file_path`, `file_type`, `uploaded_by`, `uploaded_at`) VALUES
(1, 'mmm', 'nn', '', 'nnn', 'nnnn', ' nnnnn', '2025-11-25 08:37:06');

-- --------------------------------------------------------

--
-- Table structure for table `ibikorwa`
--

CREATE TABLE `ibikorwa` (
  `igikorwa_id` int(11) NOT NULL,
  `umutwe_w_igikorwa` varchar(150) DEFAULT NULL,
  `ibisobanuro` text DEFAULT NULL,
  `itariki_y_igikorwa` date DEFAULT NULL,
  `icyiciro` enum('Umutekano','Iterambere','Isuku','Uburezi','Ubuzima','Ibindi') DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL,
  `byakozwe_na` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imibereho_myiza`
--

CREATE TABLE `imibereho_myiza` (
  `imibereho_id` int(11) NOT NULL,
  `umuturage_id` varchar(255) DEFAULT NULL,
  `gahunda_yafashwemo` varchar(100) DEFAULT NULL,
  `ibisobanuro` text DEFAULT NULL,
  `itariki_yatangiranye` date DEFAULT NULL,
  `imiterere_yayo` enum('Iri_gukorwa','Yarangiye') DEFAULT NULL,
  `amazina_y_umuturage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `imibereho_myiza`
--

INSERT INTO `imibereho_myiza` (`imibereho_id`, `umuturage_id`, `gahunda_yafashwemo`, `ibisobanuro`, `itariki_yatangiranye`, `imiterere_yayo`, `amazina_y_umuturage`) VALUES
(31, '112223333444555577', 'kurwanya imirire mibi', 'ingamba kurwanya imirire mibi', '2025-11-18', 'Iri_gukorwa', 'boduen'),
(32, '112223333444555577', 'kurwanya imirire mibi', 'nnnnnn', '2025-11-18', 'Yarangiye', 'boduen');

-- --------------------------------------------------------

--
-- Table structure for table `ingo`
--

CREATE TABLE `ingo` (
  `urugo_id` int(11) NOT NULL,
  `umukuru_w_urugo` varchar(100) DEFAULT NULL,
  `umubare_w_abagize` int(11) DEFAULT NULL,
  `aho_batuye` varchar(255) DEFAULT NULL,
  `ubwoko_bw_inzu` enum('Iyabo','Ikodeshejwe') DEFAULT NULL,
  `bafite_amazi` enum('yego','oya') DEFAULT NULL,
  `bafite_umuyoboro_wamashanyarazi` varchar(100) DEFAULT NULL,
  `icyiciro_cy_ubudehe` enum('A','B','C','D','E') DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL,
  `akagari` varchar(100) DEFAULT NULL,
  `umurenge` varchar(100) DEFAULT NULL,
  `akarere` varchar(100) DEFAULT NULL,
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingo`
--

INSERT INTO `ingo` (`urugo_id`, `umukuru_w_urugo`, `umubare_w_abagize`, `aho_batuye`, `ubwoko_bw_inzu`, `bafite_amazi`, `bafite_umuyoboro_wamashanyarazi`, `icyiciro_cy_ubudehe`, `umudugudu`, `akagari`, `umurenge`, `akarere`, `igihe_yanditswe`) VALUES
(17, 'Mbanzabugabo celestin', 7, 'karambi', 'Iyabo', NULL, NULL, 'A', 'karambi', 'mataba', 'mageragere', 'nyarugenge', '2025-11-16 10:21:39');

-- --------------------------------------------------------

--
-- Table structure for table `isibo`
--

CREATE TABLE `isibo` (
  `isibo_id` int(11) NOT NULL,
  `izina_ry_isibo` varchar(100) DEFAULT NULL,
  `umuyobozi_w_isibo` varchar(100) DEFAULT NULL,
  `umubare_w_abaturage` int(11) DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `isibo`
--

INSERT INTO `isibo` (`isibo_id`, `izina_ry_isibo`, `umuyobozi_w_isibo`, `umubare_w_abaturage`, `umudugudu`) VALUES
(4, 'twiheshe agaciro', 'shyira iriburyio venisit', 444, 'karambi'),
(5, 'twiheshe agaciro', 'shyira iriburyio venisit', 56, 'mataba');

-- --------------------------------------------------------

--
-- Table structure for table `raporo`
--

CREATE TABLE `raporo` (
  `raporo_id` int(11) NOT NULL,
  `umutwe_wa_raporo` varchar(100) DEFAULT NULL,
  `ibisobanuro` text DEFAULT NULL,
  `itariki_ya_raporo` date DEFAULT NULL,
  `umubare_w_abaturage` int(11) DEFAULT NULL,
  `umubare_w_ingo` int(11) DEFAULT NULL,
  `abanyantege_nke` int(11) DEFAULT NULL,
  `yakozwe_na` varchar(100) DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ubukungu`
--

CREATE TABLE `ubukungu` (
  `ubukungu_id` int(11) NOT NULL,
  `umuturage_id` int(11) DEFAULT NULL,
  `umurimo` varchar(100) DEFAULT NULL,
  `aho_akorera` varchar(100) DEFAULT NULL,
  `inkomoko_y_amafaranga` varchar(100) DEFAULT NULL,
  `afite_ubutaka` tinyint(1) DEFAULT NULL,
  `afite_amatungo` tinyint(1) DEFAULT NULL,
  `afite_konti_yo_kuzigama` tinyint(1) DEFAULT NULL,
  `amazina_y_umuturage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ubukungu`
--

INSERT INTO `ubukungu` (`ubukungu_id`, `umuturage_id`, `umurimo`, `aho_akorera`, `inkomoko_y_amafaranga`, `afite_ubutaka`, `afite_amatungo`, `afite_konti_yo_kuzigama`, `amazina_y_umuturage`) VALUES
(26, 2147483647, 'ubwubatsi', 'naho', 'ibiraka', 1, 1, 1, 'mmmm'),
(27, 2147483647, 'ubwubatsi', 'naho', 'ubuhinzi', 1, 0, 1, 'boduen');

-- --------------------------------------------------------

--
-- Table structure for table `uburezi`
--

CREATE TABLE `uburezi` (
  `uburezi_id` int(11) NOT NULL,
  `urwego_rw_amashuri` enum('Ntago yize','Abanza','Ayisumbuye','Kaminuza','Ayisumbuye_Yisumbuye') DEFAULT NULL,
  `umwuga` varchar(100) DEFAULT NULL,
  `ishuri_yizemo` varchar(100) DEFAULT NULL,
  `amazina_y_umuturage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uburezi`
--

INSERT INTO `uburezi` (`uburezi_id`, `urwego_rw_amashuri`, `umwuga`, `ishuri_yizemo`, `amazina_y_umuturage`) VALUES
(12, 'Abanza', 'ubwubatsi', 'burema', 'boduen');

-- --------------------------------------------------------

--
-- Table structure for table `ubuzima`
--

CREATE TABLE `ubuzima` (
  `ubuzima_id` int(11) NOT NULL,
  `afite_ubumuga` tinyint(1) DEFAULT NULL,
  `ubwoko_bw_ubumuga` varchar(100) DEFAULT NULL,
  `indwara_y_igihe_kirekire` varchar(100) DEFAULT NULL,
  `afite_mutuelle` tinyint(1) DEFAULT NULL,
  `ubwoko_bwa_mutuelle` varchar(100) DEFAULT NULL,
  `ivuriro_ajyamo` varchar(100) DEFAULT NULL,
  `amazina_y_umuturage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ubuzima`
--

INSERT INTO `ubuzima` (`ubuzima_id`, `afite_ubumuga`, `ubwoko_bw_ubumuga`, `indwara_y_igihe_kirekire`, `afite_mutuelle`, `ubwoko_bwa_mutuelle`, `ivuriro_ajyamo`, `amazina_y_umuturage`) VALUES
(20, 1, 'budakira', 'asima', 1, 'mituweli', 'nyarurenzi', 'mmmm');

-- --------------------------------------------------------

--
-- Table structure for table `urubyiruko`
--

CREATE TABLE `urubyiruko` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) NOT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `umurimo` varchar(100) DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `id_number` varchar(25) DEFAULT NULL,
  `status` enum('Rufite akazi','Rudafite akazi') DEFAULT 'Rudafite akazi',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urubyiruko`
--

INSERT INTO `urubyiruko` (`id`, `amazina`, `imyaka`, `igitsina`, `umurimo`, `nimero_ya_telephone`, `aderesi`, `id_number`, `status`, `created_at`) VALUES
(2, 'niyonkuru boduen', 20, 'Gabo', 'software development', '0792652471', 'mukarambi', '1222333333333333', 'Rufite akazi', '2025-11-16 12:26:46');

-- --------------------------------------------------------

--
-- Table structure for table `urubyiruko_rudafite_akazi`
--

CREATE TABLE `urubyiruko_rudafite_akazi` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `impamvu_yubushomeri` varchar(200) DEFAULT NULL,
  `yigeze_kora` enum('Yego','Oya') DEFAULT 'Oya',
  `yifuza_umurimo_mwene` enum('Ubuhinzi','Ubwubatsi','Ikoranabuhanga','Ubucuruzi','Ikindi') DEFAULT 'Ikindi',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urubyiruko_rudafite_akazi`
--

INSERT INTO `urubyiruko_rudafite_akazi` (`id`, `amazina`, `imyaka`, `igitsina`, `aderesi`, `nimero_ya_telephone`, `impamvu_yubushomeri`, `yigeze_kora`, `yifuza_umurimo_mwene`, `created_at`) VALUES
(1, 'nn', 22, 'Gabo', 'nyarugenge ', '0798866554', 'hhhh', 'Yego', 'Ubuhinzi', '2025-11-16 13:25:14');

-- --------------------------------------------------------

--
-- Table structure for table `urubyiruko_rukora`
--

CREATE TABLE `urubyiruko_rukora` (
  `id` int(11) NOT NULL,
  `amazina` varchar(100) DEFAULT NULL,
  `imyaka` int(11) DEFAULT NULL,
  `igitsina` enum('Gabo','Gore') DEFAULT NULL,
  `umurimo` varchar(100) DEFAULT NULL,
  `nimero_ya_telephone` varchar(15) DEFAULT NULL,
  `aderesi` varchar(100) DEFAULT NULL,
  `ubuhanga` enum('Ikoranabuhanga','Ubucuruzi','Ubuhinzi','Ubwubatsi','Ikindi') DEFAULT 'Ikindi',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urubyiruko_rukora`
--

INSERT INTO `urubyiruko_rukora` (`id`, `amazina`, `imyaka`, `igitsina`, `umurimo`, `nimero_ya_telephone`, `aderesi`, `ubuhanga`, `created_at`) VALUES
(1, 'boduen niyonkuru', 20, 'Gabo', 'software developer', '0792652471', 'karambi', 'Ikoranabuhanga', '2025-11-16 13:05:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `national_id` varchar(16) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Mudugudu','Isibo','Umunyamabanga','Bohejuru') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `national_id`, `fullname`, `email`, `telefone`, `password`, `role`, `created_at`) VALUES
(2, '0987654321123456', 'peter', 'peter@gmail.com', '0790887665', '$2b$10$7h3KEulmtQBj9PfuP3U4GuJid2OQkSF0rhKKFaofxZllAlsKHHSPu', 'Bohejuru', '2025-10-27 05:53:39'),
(4, '1234567891234567', 'kamanzi', 'kamanzi@gmail.com', '0789666554', '$2b$10$GYyZrwcxXdSF5RS9eTERieQcJ.gTWh4MCz3F6gekNsxpvSEhVvKom', 'Isibo', '2025-10-27 07:19:45'),
(5, '1234567891234568', 'kamiri', 'kamiri@gmail.com', '0789953532', '$2b$10$LijpOoTtl.mXtn5Gx4bmvOv.r6BGFHVqRxWAP/imRSEJ5mUUxZhR6', 'Umunyamabanga', '2025-10-27 08:24:14'),
(6, '1198380164826169', 'nsabimana naporewo', 'napoleonnsabimana@gmail.com', '0788287384', '$2b$10$V4caCogCYMsVYDEkHJfOsOcGZHuUKS45JI9KdNqm7ZYwhq.wW47jW', 'Mudugudu', '2025-11-11 05:16:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abagore_batwite`
--
ALTER TABLE `abagore_batwite`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `abakobwa_babyaye`
--
ALTER TABLE `abakobwa_babyaye`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `abakoresha`
--
ALTER TABLE `abakoresha`
  ADD PRIMARY KEY (`umukoresha_id`),
  ADD UNIQUE KEY `izina_rikoresha` (`izina_rikoresha`);

--
-- Indexes for table `abana`
--
ALTER TABLE `abana`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `abana_barimwo_mirire_mibi`
--
ALTER TABLE `abana_barimwo_mirire_mibi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `abasheshe_akanguhe`
--
ALTER TABLE `abasheshe_akanguhe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `abaturage`
--
ALTER TABLE `abaturage`
  ADD PRIMARY KEY (`umuturage_id`),
  ADD UNIQUE KEY `indangamuntu` (`indangamuntu`);

--
-- Indexes for table `abayobozi`
--
ALTER TABLE `abayobozi`
  ADD PRIMARY KEY (`umuyobozi_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ibikorwa`
--
ALTER TABLE `ibikorwa`
  ADD PRIMARY KEY (`igikorwa_id`);

--
-- Indexes for table `imibereho_myiza`
--
ALTER TABLE `imibereho_myiza`
  ADD PRIMARY KEY (`imibereho_id`),
  ADD KEY `umuturage_id` (`umuturage_id`);

--
-- Indexes for table `ingo`
--
ALTER TABLE `ingo`
  ADD PRIMARY KEY (`urugo_id`);

--
-- Indexes for table `isibo`
--
ALTER TABLE `isibo`
  ADD PRIMARY KEY (`isibo_id`);

--
-- Indexes for table `raporo`
--
ALTER TABLE `raporo`
  ADD PRIMARY KEY (`raporo_id`);

--
-- Indexes for table `ubukungu`
--
ALTER TABLE `ubukungu`
  ADD PRIMARY KEY (`ubukungu_id`),
  ADD KEY `umuturage_id` (`umuturage_id`);

--
-- Indexes for table `uburezi`
--
ALTER TABLE `uburezi`
  ADD PRIMARY KEY (`uburezi_id`);

--
-- Indexes for table `ubuzima`
--
ALTER TABLE `ubuzima`
  ADD PRIMARY KEY (`ubuzima_id`);

--
-- Indexes for table `urubyiruko`
--
ALTER TABLE `urubyiruko`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `urubyiruko_rudafite_akazi`
--
ALTER TABLE `urubyiruko_rudafite_akazi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `urubyiruko_rukora`
--
ALTER TABLE `urubyiruko_rukora`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `national_id` (`national_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telefone` (`telefone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abagore_batwite`
--
ALTER TABLE `abagore_batwite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abakobwa_babyaye`
--
ALTER TABLE `abakobwa_babyaye`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abakoresha`
--
ALTER TABLE `abakoresha`
  MODIFY `umukoresha_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abana`
--
ALTER TABLE `abana`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abana_barimwo_mirire_mibi`
--
ALTER TABLE `abana_barimwo_mirire_mibi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abasheshe_akanguhe`
--
ALTER TABLE `abasheshe_akanguhe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abaturage`
--
ALTER TABLE `abaturage`
  MODIFY `umuturage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `abayobozi`
--
ALTER TABLE `abayobozi`
  MODIFY `umuyobozi_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ibikorwa`
--
ALTER TABLE `ibikorwa`
  MODIFY `igikorwa_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imibereho_myiza`
--
ALTER TABLE `imibereho_myiza`
  MODIFY `imibereho_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingo`
--
ALTER TABLE `ingo`
  MODIFY `urugo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `isibo`
--
ALTER TABLE `isibo`
  MODIFY `isibo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `raporo`
--
ALTER TABLE `raporo`
  MODIFY `raporo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ubukungu`
--
ALTER TABLE `ubukungu`
  MODIFY `ubukungu_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uburezi`
--
ALTER TABLE `uburezi`
  MODIFY `uburezi_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ubuzima`
--
ALTER TABLE `ubuzima`
  MODIFY `ubuzima_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `urubyiruko`
--
ALTER TABLE `urubyiruko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `urubyiruko_rudafite_akazi`
--
ALTER TABLE `urubyiruko_rudafite_akazi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `urubyiruko_rukora`
--
ALTER TABLE `urubyiruko_rukora`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
