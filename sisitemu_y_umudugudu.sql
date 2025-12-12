-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2025 at 11:41 AM
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abana`
--

INSERT INTO `abana` (`id`, `amazina`, `imyaka`, `igitsina`, `umubyeyi_wa_mwana`, `aderesi`, `aiga`, `created_at`, `user_id`) VALUES
(1, 'kariza eme ', 2, 'Gore', 'jack', 'karambi', 'Oya', '2025-11-16 12:31:43', NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abana_barimwo_mirire_mibi`
--

INSERT INTO `abana_barimwo_mirire_mibi` (`id`, `amazina`, `imyaka`, `igitsina`, `umubyeyi_wa_mwana`, `aderesi`, `urwego_rw_imirire`, `afashijwe`, `created_at`, `user_id`) VALUES
(1, 'kevin', 2, 'Gore', 'kamanzi eme', 'nyarugenge, mageragere,mataba', 'Bikabije', 'Oya', '2025-11-16 13:35:39', NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abasheshe_akanguhe`
--

INSERT INTO `abasheshe_akanguhe` (`id`, `amazina`, `imyaka`, `igitsina`, `nimero_ya_telephone`, `aderesi`, `ukeneye_ubufasha`, `created_at`, `user_id`) VALUES
(1, 'asiyeri', 67, 'Gabo', '0798835555', 'karambi', 'Yego', '2025-11-16 12:34:25', NULL);

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
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abaturage`
--

INSERT INTO `abaturage` (`umuturage_id`, `izina_ribanza`, `izina_risoza`, `igitsina`, `itariki_y_amavuko`, `indangamuntu`, `telefone`, `isibo_id`, `urugo_id`, `icyiciro_cy_ubudehe`, `aho_ari`, `igihe_yanditswe`, `user_id`) VALUES
(6, 'RUCAMUBYUMA ', 'VINCENT', 'Gabo', '1955-12-31', '1195680028285091', '0788255270', NULL, NULL, 'A', 'Ariho', '2025-11-11 05:43:13', NULL),
(14, 'boduen', 'niyonkuru', 'Gabo', '2025-11-09', '1195680028285093', '0788355366', NULL, NULL, 'A', 'Ariho', '2025-11-13 14:24:23', NULL),
(15, 'RUCAMUBYUMA ', 'VINCENT', 'Gabo', '2025-12-08', '', '0785549152', NULL, NULL, 'A', 'Ariho', '2025-12-12 10:36:31', NULL),
(16, 'RUCAMUBYUMA ', 'VINCENT', 'Gabo', '2025-12-08', '1195680028285034', '0785549152', NULL, NULL, 'A', 'Ariho', '2025-12-12 10:38:38', 8);

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
  `umudugudu` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abayobozi`
--

INSERT INTO `abayobozi` (`umuyobozi_id`, `amazina_yose`, `telefone`, `inshingano`, `itariki_yatangiye`, `itariki_yarangije`, `umudugudu`, `user_id`) VALUES
(8, 'ishimwe olive', '0792051387', 'Ushinzwe_Imibereho', '2025-11-10', '2025-11-10', 'karambi', NULL);

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
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `description`, `file_name`, `file_path`, `file_type`, `uploaded_by`, `uploaded_at`, `user_id`) VALUES
(1, 'mmm', 'nn', '', 'nnn', 'nnnn', ' nnnnn', '2025-11-25 08:37:06', NULL);

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
  `byakozwe_na` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
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
  `amazina_y_umuturage` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `imibereho_myiza`
--

INSERT INTO `imibereho_myiza` (`imibereho_id`, `umuturage_id`, `gahunda_yafashwemo`, `ibisobanuro`, `itariki_yatangiranye`, `imiterere_yayo`, `amazina_y_umuturage`, `user_id`) VALUES
(31, '112223333444555577', 'kurwanya imirire mibi', 'ingamba kurwanya imirire mibi', '2025-11-18', 'Iri_gukorwa', 'boduen', NULL),
(32, '112223333444555577', 'kurwanya imirire mibi', 'nnnnnn', '2025-11-18', 'Yarangiye', 'boduen', NULL);

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
  `igihe_yanditswe` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingo`
--

INSERT INTO `ingo` (`urugo_id`, `umukuru_w_urugo`, `umubare_w_abagize`, `aho_batuye`, `ubwoko_bw_inzu`, `bafite_amazi`, `bafite_umuyoboro_wamashanyarazi`, `icyiciro_cy_ubudehe`, `umudugudu`, `akagari`, `umurenge`, `akarere`, `igihe_yanditswe`, `user_id`) VALUES
(17, 'Mbanzabugabo celestin', 7, 'karambi', 'Iyabo', NULL, NULL, 'A', 'karambi', 'mataba', 'mageragere', 'nyarugenge', '2025-11-16 10:21:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inkunga_leta`
--

CREATE TABLE `inkunga_leta` (
  `id` int(11) NOT NULL,
  `umuturage` varchar(255) NOT NULL,
  `ubwoko` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `itariki` date NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `isibo`
--

CREATE TABLE `isibo` (
  `isibo_id` int(11) NOT NULL,
  `izina_ry_isibo` varchar(100) DEFAULT NULL,
  `umuyobozi_w_isibo` varchar(100) DEFAULT NULL,
  `umubare_w_abaturage` int(11) DEFAULT NULL,
  `umudugudu` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `text_user` text NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `umudugudu` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
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
  `amazina_y_umuturage` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `uburezi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ubukungu`
--

INSERT INTO `ubukungu` (`ubukungu_id`, `umuturage_id`, `umurimo`, `aho_akorera`, `inkomoko_y_amafaranga`, `afite_ubutaka`, `afite_amatungo`, `afite_konti_yo_kuzigama`, `amazina_y_umuturage`, `user_id`, `uburezi`) VALUES
(26, 2147483647, 'ubwubatsi', 'naho', 'ibiraka', 1, 1, 1, 'mmmm', NULL, NULL),
(27, 2147483647, 'ubwubatsi', 'naho', 'ubuhinzi', 1, 0, 1, 'boduen', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `uburezi`
--

CREATE TABLE `uburezi` (
  `uburezi_id` int(11) NOT NULL,
  `urwego_rw_amashuri` enum('Ntago yize','Abanza','Ayisumbuye','Kaminuza','Ayisumbuye_Yisumbuye') DEFAULT NULL,
  `umwuga` varchar(100) DEFAULT NULL,
  `ishuri_yizemo` varchar(100) DEFAULT NULL,
  `amazina_y_umuturage` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uburezi`
--

INSERT INTO `uburezi` (`uburezi_id`, `urwego_rw_amashuri`, `umwuga`, `ishuri_yizemo`, `amazina_y_umuturage`, `user_id`) VALUES
(12, 'Abanza', 'ubwubatsi', 'burema', 'boduen', NULL);

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
  `amazina_y_umuturage` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `umusanzu_ejoheza`
--

CREATE TABLE `umusanzu_ejoheza` (
  `id` int(11) NOT NULL,
  `umuturage` varchar(255) NOT NULL,
  `amafaranga` int(11) NOT NULL,
  `itariki` date NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `umusanzu_fpr`
--

CREATE TABLE `umusanzu_fpr` (
  `id` int(11) NOT NULL,
  `umuturage` varchar(255) NOT NULL,
  `amafaranga` int(11) NOT NULL,
  `itariki` date NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urubyiruko`
--

INSERT INTO `urubyiruko` (`id`, `amazina`, `imyaka`, `igitsina`, `umurimo`, `nimero_ya_telephone`, `aderesi`, `id_number`, `status`, `created_at`, `user_id`) VALUES
(2, 'niyonkuru boduen', 20, 'Gabo', 'software development', '0792652471', 'mukarambi', '1222333333333333', 'Rufite akazi', '2025-11-16 12:26:46', NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `urubyiruko_rudafite_akazi`
--

INSERT INTO `urubyiruko_rudafite_akazi` (`id`, `amazina`, `imyaka`, `igitsina`, `aderesi`, `nimero_ya_telephone`, `impamvu_yubushomeri`, `yigeze_kora`, `yifuza_umurimo_mwene`, `created_at`, `user_id`) VALUES
(1, 'nn', 22, 'Gabo', 'nyarugenge ', '0798866554', 'hhhh', 'Yego', 'Ubuhinzi', '2025-11-16 13:25:14', NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
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

INSERT INTO `users` (`user_id`, `national_id`, `fullname`, `email`, `telefone`, `password`, `role`, `created_at`) VALUES
(8, '1234567890123456', 'boduen', 'boduen@gmail.com', '0792652471', '$2b$10$vOy.U6A47NyUIvOmXvLVVeAyCbp4uxDrXFlshUq3Jv4bPkVb3bTfC', 'Mudugudu', '2025-12-12 10:37:29'),
(9, '1123456789009876', 'king boneri', 'niyonkuruboduensun@gmail.com', '0792652467', '$2b$10$vcpgrBiSVURBAQ4ofod7aeYkmsu3GibnvwSrIkd6C6bZGnSH7iQ5a', 'Mudugudu', '2025-12-12 10:39:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abagore_batwite`
--
ALTER TABLE `abagore_batwite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_abagore_user` (`user_id`);

--
-- Indexes for table `abakobwa_babyaye`
--
ALTER TABLE `abakobwa_babyaye`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_abakobwa_user` (`user_id`);

--
-- Indexes for table `abakoresha`
--
ALTER TABLE `abakoresha`
  ADD PRIMARY KEY (`umukoresha_id`),
  ADD UNIQUE KEY `izina_rikoresha` (`izina_rikoresha`),
  ADD KEY `fk_abakoresha_user` (`user_id`);

--
-- Indexes for table `abana`
--
ALTER TABLE `abana`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_abana_user` (`user_id`);

--
-- Indexes for table `abana_barimwo_mirire_mibi`
--
ALTER TABLE `abana_barimwo_mirire_mibi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_abana_barimwo_mirire_mibi_user` (`user_id`);

--
-- Indexes for table `abasheshe_akanguhe`
--
ALTER TABLE `abasheshe_akanguhe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_abasheshe_akanguhe_user` (`user_id`);

--
-- Indexes for table `abaturage`
--
ALTER TABLE `abaturage`
  ADD PRIMARY KEY (`umuturage_id`),
  ADD UNIQUE KEY `indangamuntu` (`indangamuntu`),
  ADD KEY `fk_abaturage_user` (`user_id`);

--
-- Indexes for table `abayobozi`
--
ALTER TABLE `abayobozi`
  ADD PRIMARY KEY (`umuyobozi_id`),
  ADD KEY `fk_abayobozi_user` (`user_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_documents_user` (`user_id`);

--
-- Indexes for table `ibikorwa`
--
ALTER TABLE `ibikorwa`
  ADD PRIMARY KEY (`igikorwa_id`),
  ADD KEY `fk_ibikorwa_user` (`user_id`);

--
-- Indexes for table `imibereho_myiza`
--
ALTER TABLE `imibereho_myiza`
  ADD PRIMARY KEY (`imibereho_id`),
  ADD KEY `umuturage_id` (`umuturage_id`),
  ADD KEY `fk_imibereho_myiza_user` (`user_id`);

--
-- Indexes for table `ingo`
--
ALTER TABLE `ingo`
  ADD PRIMARY KEY (`urugo_id`),
  ADD KEY `fk_ingo_user` (`user_id`);

--
-- Indexes for table `inkunga_leta`
--
ALTER TABLE `inkunga_leta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `isibo`
--
ALTER TABLE `isibo`
  ADD PRIMARY KEY (`isibo_id`),
  ADD KEY `fk_isibo_user` (`user_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `raporo`
--
ALTER TABLE `raporo`
  ADD PRIMARY KEY (`raporo_id`),
  ADD KEY `fk_raporo_user` (`user_id`);

--
-- Indexes for table `ubukungu`
--
ALTER TABLE `ubukungu`
  ADD PRIMARY KEY (`ubukungu_id`),
  ADD KEY `umuturage_id` (`umuturage_id`),
  ADD KEY `fk_ubukungu_user` (`user_id`);

--
-- Indexes for table `uburezi`
--
ALTER TABLE `uburezi`
  ADD PRIMARY KEY (`uburezi_id`),
  ADD KEY `fk_uburezi_user` (`user_id`);

--
-- Indexes for table `ubuzima`
--
ALTER TABLE `ubuzima`
  ADD PRIMARY KEY (`ubuzima_id`),
  ADD KEY `fk_ubuzima_user` (`user_id`);

--
-- Indexes for table `umusanzu_ejoheza`
--
ALTER TABLE `umusanzu_ejoheza`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `umusanzu_fpr`
--
ALTER TABLE `umusanzu_fpr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `urubyiruko`
--
ALTER TABLE `urubyiruko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_urubyiruko_fpr_user` (`user_id`);

--
-- Indexes for table `urubyiruko_rudafite_akazi`
--
ALTER TABLE `urubyiruko_rudafite_akazi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_urubyiruko_rudafite_akazi_fpr_user` (`user_id`);

--
-- Indexes for table `urubyiruko_rukora`
--
ALTER TABLE `urubyiruko_rukora`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_urubyiruko_rukora_fpr_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
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
-- AUTO_INCREMENT for table `inkunga_leta`
--
ALTER TABLE `inkunga_leta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `isibo`
--
ALTER TABLE `isibo`
  MODIFY `isibo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `umusanzu_ejoheza`
--
ALTER TABLE `umusanzu_ejoheza`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `umusanzu_fpr`
--
ALTER TABLE `umusanzu_fpr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `abagore_batwite`
--
ALTER TABLE `abagore_batwite`
  ADD CONSTRAINT `fk_abagore_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abakobwa_babyaye`
--
ALTER TABLE `abakobwa_babyaye`
  ADD CONSTRAINT `fk_abakobwa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abakoresha`
--
ALTER TABLE `abakoresha`
  ADD CONSTRAINT `fk_abakoresha_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abana`
--
ALTER TABLE `abana`
  ADD CONSTRAINT `fk_abana_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abana_barimwo_mirire_mibi`
--
ALTER TABLE `abana_barimwo_mirire_mibi`
  ADD CONSTRAINT `fk_abana_barimwo_mirire_mibi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abasheshe_akanguhe`
--
ALTER TABLE `abasheshe_akanguhe`
  ADD CONSTRAINT `fk_abasheshe_akanguhe_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abaturage`
--
ALTER TABLE `abaturage`
  ADD CONSTRAINT `fk_abaturage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `abayobozi`
--
ALTER TABLE `abayobozi`
  ADD CONSTRAINT `fk_abayobozi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_documents_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ibikorwa`
--
ALTER TABLE `ibikorwa`
  ADD CONSTRAINT `fk_ibikorwa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `imibereho_myiza`
--
ALTER TABLE `imibereho_myiza`
  ADD CONSTRAINT `fk_imibereho_myiza_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ingo`
--
ALTER TABLE `ingo`
  ADD CONSTRAINT `fk_ingo_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `inkunga_leta`
--
ALTER TABLE `inkunga_leta`
  ADD CONSTRAINT `fk_inkunga_leta_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `inkunga_leta_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `isibo`
--
ALTER TABLE `isibo`
  ADD CONSTRAINT `fk_isibo_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_message_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `raporo`
--
ALTER TABLE `raporo`
  ADD CONSTRAINT `fk_raporo_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ubukungu`
--
ALTER TABLE `ubukungu`
  ADD CONSTRAINT `fk_ubukungu_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `uburezi`
--
ALTER TABLE `uburezi`
  ADD CONSTRAINT `fk_uburezi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ubuzima`
--
ALTER TABLE `ubuzima`
  ADD CONSTRAINT `fk_ubuzima_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `umusanzu_ejoheza`
--
ALTER TABLE `umusanzu_ejoheza`
  ADD CONSTRAINT `fk_umusanzu_ejoheza_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `umusanzu_ejoheza_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `umusanzu_fpr`
--
ALTER TABLE `umusanzu_fpr`
  ADD CONSTRAINT `fk_umusanzu_fpr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `umusanzu_fpr_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `urubyiruko`
--
ALTER TABLE `urubyiruko`
  ADD CONSTRAINT `fk_urubyiruko_fpr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `urubyiruko_rudafite_akazi`
--
ALTER TABLE `urubyiruko_rudafite_akazi`
  ADD CONSTRAINT `fk_urubyiruko_rudafite_akazi_fpr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `urubyiruko_rukora`
--
ALTER TABLE `urubyiruko_rukora`
  ADD CONSTRAINT `fk_urubyiruko_rukora_fpr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
