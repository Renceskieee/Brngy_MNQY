-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2026 at 10:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barangay_nbbs_dagat-dagatan`
--

-- --------------------------------------------------------

--
-- Table structure for table `carousel`
--

CREATE TABLE `carousel` (
  `id` int(11) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `position` int(11) NOT NULL DEFAULT 1,
  `posted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carousel`
--

INSERT INTO `carousel` (`id`, `picture`, `position`, `posted_at`) VALUES
(13, '/uploads/personalisation/images/carousel-1767277057834-363657297.jpg', 1, '2026-01-01 14:17:37'),
(15, '/uploads/personalisation/images/carousel-1767277065190-658462525.jpg', 3, '2026-01-01 14:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `household_id` int(11) DEFAULT NULL,
  `incident_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `households`
--

CREATE TABLE `households` (
  `id` int(11) NOT NULL,
  `household_name` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `households`
--

INSERT INTO `households` (`id`, `household_name`, `address`, `created_at`, `updated_at`) VALUES
(17, 'Dela Cruz Household', 'Block 12, Lot 4, Phase 1, NBBS Dagat-Dagatan', '2025-12-30 05:01:20', '2025-12-30 05:01:20'),
(18, 'Bautista Household', '142 Kapak St., NBBS Dagat-Dagatan', '2025-12-30 05:01:20', '2025-12-30 05:01:20'),
(19, 'Garcia Household', 'Block 5, Phase 2, Area 1', '2025-12-30 05:01:20', '2025-12-30 05:01:20'),
(20, 'Mendoza Household', '22 Dalagang Bukid St.', '2025-12-30 05:01:20', '2025-12-30 05:01:20');

-- --------------------------------------------------------

--
-- Table structure for table `household_members`
--

CREATE TABLE `household_members` (
  `id` int(11) NOT NULL,
  `household_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `role` enum('head','member','dependent') NOT NULL DEFAULT 'member',
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `household_members`
--

INSERT INTO `household_members` (`id`, `household_id`, `resident_id`, `role`, `added_at`) VALUES
(19, 18, 53, 'head', '2025-12-30 05:02:04'),
(20, 18, 54, 'member', '2025-12-30 05:02:04'),
(21, 17, 52, 'member', '2025-12-30 05:03:23'),
(22, 17, 50, 'member', '2025-12-30 05:03:23'),
(23, 17, 49, 'head', '2025-12-30 05:03:23'),
(24, 17, 51, 'member', '2025-12-30 05:03:23'),
(25, 19, 56, 'member', '2025-12-30 05:05:00'),
(26, 19, 57, 'member', '2025-12-30 05:05:00'),
(27, 19, 55, 'head', '2025-12-30 05:05:00'),
(28, 19, 58, 'member', '2025-12-30 05:05:00'),
(29, 20, 60, 'member', '2025-12-30 05:05:25'),
(30, 20, 59, 'head', '2025-12-30 05:05:25');

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `reference_number` varchar(50) NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `location` text NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `complainant` varchar(150) NOT NULL,
  `respondent` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','ongoing','resolved','dismissed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incidents`
--

INSERT INTO `incidents` (`id`, `reference_number`, `incident_type`, `location`, `date`, `time`, `complainant`, `respondent`, `description`, `status`, `created_at`, `updated_at`) VALUES
(99, 'INC-2025-000099', 'Noise Disturbance', 'House No. 12, Purok 1, Barangay Dagat-Dagatan, Caloocan City', '2025-01-05', '22:30:00', 'Juan Dela Cruz', 'Pedro Santos', 'Loud music was reported late at night causing disturbance to nearby households.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(100, 'INC-2025-000100', 'Physical Altercation', 'Basketball Court, Purok 2, Barangay Dagat-Dagatan', '2025-01-07', '18:15:00', 'Maria Reyes', 'Jose Mendoza', 'Verbal argument escalated into a minor physical altercation.', 'ongoing', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(101, 'INC-2025-000101', 'Domestic Dispute', 'House No. 45, Purok 3, Barangay Dagat-Dagatan', '2025-01-10', '20:00:00', 'Ana Villanueva', 'Mark Villanueva', 'Heated argument between spouses reported by neighbors.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(102, 'INC-2025-000102', 'Property Damage', 'Sari-sari Store, Purok 4, Barangay Dagat-Dagatan', '2025-01-12', '16:40:00', 'Grace Navarro', 'Daniel Cortez', 'Respondent allegedly damaged store property during an argument.', 'ongoing', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(103, 'INC-2025-000103', 'Public Disturbance', 'Street Corner, Purok 5, Barangay Dagat-Dagatan', '2025-01-14', '21:10:00', 'Paul Lim', 'Unknown Male', 'An intoxicated individual caused disturbance along the street.', 'dismissed', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(104, 'INC-2025-000104', 'Theft', 'House No. 78, Purok 6, Barangay Dagat-Dagatan', '2025-01-16', '03:20:00', 'Christine Aquino', 'Michael Chua', 'Personal belongings were reported missing inside the residence.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(105, 'INC-2025-000105', 'Verbal Abuse', 'Barangay Hall, Barangay Dagat-Dagatan', '2025-01-18', '10:30:00', 'Ramon Castillo', 'Kevin Ortega', 'Respondent verbally insulted the complainant during a barangay meeting.', 'resolved', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(106, 'INC-2025-000106', 'Boundary Dispute', 'Purok 7, Barangay Dagat-Dagatan', '2025-01-20', '09:45:00', 'Liza Fernandez', 'Patricia Valdez', 'Disagreement regarding property boundary lines.', 'ongoing', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(107, 'INC-2025-000107', 'Traffic Altercation', 'Main Road, Barangay Dagat-Dagatan', '2025-01-22', '17:50:00', 'Leonard Quizon', 'Arvin Bautista', 'Road rage incident involving motorcycles.', 'resolved', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(108, 'INC-2025-000108', 'Noise Disturbance', 'House No. 30, Purok 2, Barangay Dagat-Dagatan', '2025-01-24', '23:15:00', 'Monica Ramos', 'Elaine Pascual', 'Karaoke session continued past allowed hours.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(109, 'INC-2025-000109', 'Physical Injury', 'Construction Site, Purok 3, Barangay Dagat-Dagatan', '2025-01-26', '14:00:00', 'Dennis Rosales', 'Bryan Ilagan', 'Workplace disagreement resulted in minor injuries.', 'ongoing', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(110, 'INC-2025-000110', 'Harassment', 'Public Market, Barangay Dagat-Dagatan', '2025-01-28', '11:25:00', 'Sofia Morales', 'Unknown Female', 'Complainant reported repeated verbal harassment.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(111, 'INC-2025-000111', 'Illegal Parking', 'Barangay Road, Purok 4, Barangay Dagat-Dagatan', '2025-01-30', '08:10:00', 'Barangay Tanod', 'Roland Peralta', 'Vehicle was parked illegally causing traffic obstruction.', 'resolved', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(112, 'INC-2025-000112', 'Vandalism', 'Waiting Shed, Purok 6, Barangay Dagat-Dagatan', '2025-02-01', '01:55:00', 'Barangay Council', 'Unknown Persons', 'Graffiti found on public property.', 'pending', '2025-12-31 14:13:14', '2025-12-31 14:13:14'),
(113, 'INC-2025-000113', 'Curfew Violation', 'Purok 1, Barangay Dagat-Dagatan', '2025-02-02', '00:30:00', 'Barangay Tanod', 'Aileen Samson', 'Minor was found outside during curfew hours.', 'resolved', '2025-12-31 14:13:14', '2025-12-31 14:13:14');

--
-- Triggers `incidents`
--
DELIMITER $$
CREATE TRIGGER `trg_generate_incident_reference` BEFORE INSERT ON `incidents` FOR EACH ROW BEGIN
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    SET @next_id = (SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'incidents');
    SET NEW.reference_number = CONCAT('INC-', YEAR(NOW()), '-', LPAD(@next_id, 6, '0'));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `personalisation`
--

CREATE TABLE `personalisation` (
  `id` tinyint(4) NOT NULL DEFAULT 1 CHECK (`id` = 1),
  `logo` varchar(255) DEFAULT NULL,
  `main_bg` varchar(255) DEFAULT NULL,
  `header_title` varchar(255) DEFAULT NULL,
  `header_color` varchar(50) DEFAULT NULL,
  `footer_title` varchar(255) DEFAULT NULL,
  `footer_color` varchar(50) DEFAULT NULL,
  `login_color` varchar(50) DEFAULT NULL,
  `profile_bg` varchar(50) DEFAULT NULL,
  `active_nav_color` varchar(50) DEFAULT NULL,
  `button_color` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalisation`
--

INSERT INTO `personalisation` (`id`, `logo`, `main_bg`, `header_title`, `header_color`, `footer_title`, `footer_color`, `login_color`, `profile_bg`, `active_nav_color`, `button_color`, `updated_at`) VALUES
(1, '/uploads/logo/logo-1766647338113-775837713.png', '/uploads/personalisation/background/main_bg-1766650002303-317238879.jpg', 'SK Barangay Information System - Brgy. Dagat-Dagatan', '#FFE52A', 'SK Barangay Information System 2025', '#FFE52A', '#000000', '#BBCB64', '#CF0F0F', '#CF0F0F', '2026-01-02 02:34:47');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(11) NOT NULL,
  `f_name` varchar(100) NOT NULL,
  `m_name` varchar(100) DEFAULT NULL,
  `l_name` varchar(100) NOT NULL,
  `suffix` enum('NA','Jr.','Sr.','II','III','IV') DEFAULT 'NA',
  `sex` enum('male','female') NOT NULL,
  `birthdate` date NOT NULL,
  `civil_status` enum('single','married','widowed','separated','annulled') NOT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `f_name`, `m_name`, `l_name`, `suffix`, `sex`, `birthdate`, `civil_status`, `contact_no`, `email`, `address`, `created_at`, `updated_at`) VALUES
(49, 'Ricardo', 'Pineda', 'Dela Cruz', 'Sr.', 'male', '1975-05-12', 'married', '09171234567', 'ricardo.dc@email.com', 'Block 12, Lot 4, Phase 1, NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(50, 'Maria', 'Santos', 'Dela Cruz', 'NA', 'female', '1978-08-20', 'married', '09171234568', 'maria.dc@email.com', 'Block 12, Lot 4, Phase 1, NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(51, 'Ricardo', 'Santos', 'Dela Cruz', 'Jr.', 'male', '2005-01-15', 'single', '09171234569', 'ricardojr.dc@email.com', 'Block 12, Lot 4, Phase 1, NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(52, 'Angelica', 'Santos', 'Dela Cruz', 'NA', 'female', '2008-11-30', 'single', NULL, NULL, 'Block 12, Lot 4, Phase 1, NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(53, 'Antonio', 'Gomez', 'Bautista', 'NA', 'male', '1960-03-25', 'widowed', '09182223344', 'antonio.b@email.com', '142 Kapak St., NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(54, 'Elena', 'Bautista', 'Bautista', 'NA', 'female', '1985-07-10', 'single', '09182223345', 'elena.b@email.com', '142 Kapak St., NBBS Dagat-Dagatan', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(55, 'Roberto', 'Luna', 'Garcia', 'III', 'male', '1982-12-05', 'married', '09205556677', 'roberto.g3@email.com', 'Block 5, Phase 2, Area 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(56, 'Cynthia', 'Reyes', 'Garcia', 'NA', 'female', '1984-02-14', 'married', '09205556678', 'cynthia.g@email.com', 'Block 5, Phase 2, Area 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(57, 'Mateo', 'Reyes', 'Garcia', 'NA', 'male', '2012-06-20', 'single', NULL, NULL, 'Block 5, Phase 2, Area 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(58, 'Sofia', 'Reyes', 'Garcia', 'NA', 'female', '2015-09-12', 'single', NULL, NULL, 'Block 5, Phase 2, Area 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(59, 'Juanito', 'Castro', 'Mendoza', 'NA', 'male', '1990-10-10', 'married', '09459998877', 'juan.mendoza@email.com', '22 Dalagang Bukid St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(60, 'Clarissa', 'Villanueva', 'Mendoza', 'NA', 'female', '1992-04-05', 'married', '09459998878', 'clari.m@email.com', '22 Dalagang Bukid St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(61, 'Mark', 'Anthony', 'Villanueva', 'NA', 'male', '1995-01-22', 'single', '09151112233', 'mark.v@email.com', 'Block 2, Lot 10, Phase 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(62, 'Teresa', 'May', 'Aquino', 'NA', 'female', '1988-11-03', 'separated', '09164445566', 'tess.aquino@email.com', 'Block 8, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(63, 'Fernando', 'Luis', 'Pascual', 'Sr.', 'male', '1955-06-18', 'married', '09227778899', 'ferdie.p@email.com', '45 Lapu-Lapu Avenue', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(64, 'Lourdes', 'Cruz', 'Pascual', 'NA', 'female', '1958-02-28', 'married', '09227778800', 'lourdes.p@email.com', '45 Lapu-Lapu Avenue', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(65, 'Jose', 'Rizalino', 'Mercado', 'NA', 'male', '1998-12-30', 'single', '09331239876', 'jose.merc@email.com', 'Block 1, Lot 1, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(66, 'Grace', 'Poe', 'Llamanzares', 'NA', 'female', '1970-09-03', 'married', '09085551234', 'grace.p@email.com', '12 Tambak St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(67, 'Rodrigo', 'Roa', 'Duterte', 'NA', 'male', '1945-03-28', 'separated', '09096667788', 'digong@email.com', 'Block 15, Area 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(68, 'Leni', 'Gerona', 'Robredo', 'NA', 'female', '1965-04-23', 'widowed', '09170001122', 'leni.r@email.com', 'Block 3, Phase 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(69, 'Ferdinand', 'Romualdez', 'Marcos', 'Jr.', 'male', '1957-09-13', 'married', '09183334455', 'bongbong@email.com', 'Block 7, Lot 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(70, 'Imelda', 'Remedios', 'Marcos', 'NA', 'female', '1929-07-02', 'widowed', '09183334456', 'imelda.m@email.com', 'Block 7, Lot 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(71, 'Manuel', 'Luis', 'Quezon', 'III', 'male', '1970-05-30', 'married', '09192228833', 'mlq3@email.com', 'Block 4, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(72, 'Corazon', 'Sumulong', 'Cojuangco', 'NA', 'female', '1933-01-25', 'widowed', '09158889900', 'cory.c@email.com', '101 Agusan St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(73, 'Benigno', 'Simeon', 'Aquino', 'III', 'male', '1960-02-08', 'single', '09158889901', 'pnoy@email.com', '101 Agusan St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(74, 'Gloria', 'Macapagal', 'Arroyo', 'NA', 'female', '1947-04-05', 'married', '09167773322', 'gma@email.com', 'Block 9, Phase 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(75, 'Joseph', 'Ejercito', 'Estrada', 'NA', 'male', '1937-04-19', 'married', '09176664433', 'erap@email.com', 'Block 2, Area 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(76, 'Francisco', 'Balagtas', 'Baltazar', 'NA', 'male', '1985-04-02', 'single', '09281112244', 'kiko.b@email.com', '12 Florante St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(77, 'Melchora', 'Aquino', 'Ramos', 'NA', 'female', '1940-01-06', 'widowed', '09395556677', 'tandangsora@email.com', '88 Banahaw St.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(78, 'Andres', 'Castañeda', 'Bonifacio', 'NA', 'male', '1992-11-30', 'married', '09478889900', 'supremo@email.com', 'Block 11, Phase 4', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(79, 'Gregoria', 'De Jesus', 'Bonifacio', 'NA', 'female', '1994-05-09', 'married', '09478889901', 'orian@email.com', 'Block 11, Phase 4', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(80, 'Emilio', 'Famy', 'Aguinaldo', 'NA', 'male', '1950-03-22', 'married', '09562223344', 'miong@email.com', 'Block 6, Area 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(81, 'Apolinario', 'Mabini', 'Maranan', 'NA', 'male', '1964-07-23', 'single', '09663334455', 'mabini.a@email.com', 'Block 1, Phase 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(82, 'Marcelo', 'Hilario', 'Del Pilar', 'NA', 'male', '1980-08-30', 'married', '09774445566', 'plaridel@email.com', 'Block 10, Lot 5', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(83, 'Juan', 'Luna', 'Novicio', 'NA', 'male', '1975-10-23', 'married', '09985556677', 'jluna@email.com', 'Block 14, Phase 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(84, 'Antonio', 'Luna', 'Novicio', 'NA', 'male', '1978-10-29', 'single', '09985556678', 'aluna@email.com', 'Block 14, Phase 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(85, 'Gabriela', 'Cariño', 'Silang', 'NA', 'female', '1982-03-19', 'widowed', '09121110099', 'gabriela.s@email.com', 'Block 3, Area 4', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(86, 'Teresa', 'Ferreiro', 'Magbanua', 'NA', 'female', '1970-10-13', 'married', '09132221100', 'teresa.m@email.com', 'Block 5, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(87, 'Lapu', 'Lapu', 'Dimagiba', 'NA', 'male', '1990-01-01', 'single', '09143332211', 'lapu2@email.com', 'Mactan St. Ext.', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(88, 'Sultan', 'Kudarat', 'Nasiruddin', 'NA', 'male', '1960-05-05', 'married', '09154443322', 'sultan.k@email.com', 'Block 20, Phase 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(89, 'Hadji', 'Butu', 'Abdul', 'NA', 'male', '1975-02-15', 'married', '09165554433', 'hadji.b@email.com', 'Block 21, Phase 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(90, 'Teodora', 'Alonzo', 'Realonda', 'NA', 'female', '1945-11-09', 'widowed', '09176665544', 'teodora.r@email.com', 'Block 1, Lot 1, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(91, 'Paciano', 'Rizal', 'Mercado', 'NA', 'male', '1955-03-07', 'single', '09187776655', 'paciano.m@email.com', 'Block 1, Lot 1, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(92, 'Trinidad', 'Rizal', 'Mercado', 'NA', 'female', '1962-06-06', 'single', '09198887766', 'trini.m@email.com', 'Block 1, Lot 1, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(93, 'Geronima', 'Pecson', 'Tomacruz', 'NA', 'female', '1972-12-19', 'married', '09209998877', 'geronima.p@email.com', 'Block 18, Area 2', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(94, 'Fe', 'Del Mundo', 'Villanueva', 'NA', 'female', '1951-11-27', 'single', '09210009988', 'fedelmundo@email.com', 'Block 22, Phase 4', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(95, 'Carlos', 'Pena', 'Romulo', 'NA', 'male', '1949-01-14', 'married', '09221110099', 'cpromulo@email.com', 'Block 25, Area 3', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(96, 'Ramon', 'Fierros', 'Magsaysay', 'NA', 'male', '1953-08-31', 'married', '09232221100', 'ramon.m@email.com', 'Block 30, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(97, 'Luz', 'Banzon', 'Magsaysay', 'NA', 'female', '1955-06-25', 'widowed', '09232221101', 'luz.m@email.com', 'Block 30, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14'),
(98, 'Sergio', 'Suico', 'Osmeña', 'Sr.', 'male', '1948-09-09', 'married', '09243332211', 'sergio.o@email.com', 'Block 2, Phase 1', '2025-12-30 04:58:14', '2025-12-30 04:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `location` text NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('scheduled','ongoing','completed') NOT NULL DEFAULT 'scheduled',
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_beneficiaries`
--

CREATE TABLE `service_beneficiaries` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_log`
--

CREATE TABLE `time_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `logged_in` timestamp NOT NULL DEFAULT current_timestamp(),
  `logged_out` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_log`
--

INSERT INTO `time_log` (`id`, `user_id`, `logged_in`, `logged_out`) VALUES
(5, 2, '2025-12-30 03:08:13', '2025-12-30 04:37:51'),
(6, 1, '2025-12-30 03:10:17', '2025-12-30 12:18:22'),
(7, 2, '2025-12-30 04:52:21', '2025-12-30 05:22:29'),
(8, 2, '2025-12-30 05:32:35', '2025-12-30 07:02:16'),
(9, 2, '2025-12-31 02:41:06', '2025-12-31 02:41:33'),
(10, 1, '2025-12-31 02:42:01', '2025-12-31 18:18:34'),
(11, 5, '2025-12-31 08:44:55', '2025-12-31 08:45:49'),
(12, 2, '2025-12-31 11:41:50', '2025-12-31 17:51:52'),
(13, 2, '2025-12-31 18:14:30', '2025-12-31 18:17:50'),
(14, 1, '2026-01-01 13:50:53', '2026-01-01 14:12:36'),
(15, 1, '2026-01-01 14:13:18', '2026-01-01 14:49:51'),
(16, 1, '2026-01-02 02:31:00', '2026-01-02 05:52:43'),
(17, 2, '2026-01-02 02:34:22', '2026-01-02 03:33:23'),
(18, 4, '2026-01-02 03:34:15', '2026-01-02 03:36:04'),
(19, 4, '2026-01-02 03:36:38', '2026-01-02 03:36:45'),
(20, 4, '2026-01-02 03:37:49', '2026-01-02 03:43:16'),
(21, 1, '2026-01-02 05:53:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `position` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `first_name`, `last_name`, `email`, `contact_number`, `profile_picture`, `position`, `status`, `created_at`, `updated_at`) VALUES
(1, '224-09160M', '$2b$10$EX0RSAVaKr7wL5wIilZFw.7posedKiJZpPXqpmdtKm0TG1Pz/5KAm', 'Laurence Paul', 'Quiniano', 'quiniano.lp.bsinfotech@gmail.com', '09946085013', '/uploads/profile/profile-1767077847655-249564712.png', 'admin', 'active', '2025-12-12 06:45:59', '2026-01-02 03:39:17'),
(2, '224-09159M', '$2b$10$Su3YPJ0P1lI.crNRszanEegNdr5ytPEdnROfE0JlNRw3146qXIOz2', 'Angela Tanya', 'Navarrosa', 'navarrosa.at.bsinfotech@gmail.com', '09942611480', NULL, 'staff', 'active', '2025-12-12 06:59:37', '2026-01-02 03:39:13'),
(3, '224-09127M', '$2b$10$ZXQXYdD1FrT5PeZbP3s.LejOyPRgVNyAbmOOVsxe80BiXQh/TC2di', 'Laurence', 'Quiniano', 'quiniano.lp@gmail.com', '09685408094', NULL, 'staff', 'inactive', '2025-12-12 09:34:10', '2026-01-02 03:39:10'),
(4, '224-09162M', '$2b$10$VTc7RPxAdxIYVBJLq5SFfuBs90BG1ANyAtpGa/lcHoF0avcN6bIW2', 'Laurence Paul', 'Quiniano', 'quiniano.infotech@gmail.com', '09156128497', NULL, 'staff', 'active', '2025-12-12 09:46:28', '2026-01-02 03:38:55'),
(5, '224-09161M', '$2b$10$z5I7I7Zl4H8LnnV7ti2r9uukB9xn1VdyVMpuMPqpaJ/pXAg5Uul72', 'Aaliyah Paula', 'Quiniano', 'quiniano.aaliyahp@gmail.com', '09685408094', NULL, 'staff', 'active', '2025-12-19 08:31:22', '2026-01-02 03:39:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carousel`
--
ALTER TABLE `carousel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_history_user` (`user_id`),
  ADD KEY `fk_history_resident` (`resident_id`),
  ADD KEY `fk_history_incident` (`incident_id`),
  ADD KEY `fk_history_household` (`household_id`),
  ADD KEY `fk_history_service` (`service_id`);

--
-- Indexes for table `households`
--
ALTER TABLE `households`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `household_members`
--
ALTER TABLE `household_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_resident` (`resident_id`),
  ADD KEY `fk_household_members_household` (`household_id`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_number` (`reference_number`);

--
-- Indexes for table `personalisation`
--
ALTER TABLE `personalisation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_no` (`contact_no`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_service_resident` (`service_id`,`resident_id`),
  ADD KEY `fk_service_beneficiaries_resident` (`resident_id`);

--
-- Indexes for table `time_log`
--
ALTER TABLE `time_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_time_log_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carousel`
--
ALTER TABLE `carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `households`
--
ALTER TABLE `households`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `household_members`
--
ALTER TABLE `household_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `time_log`
--
ALTER TABLE `time_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `fk_history_household` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_incident` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `household_members`
--
ALTER TABLE `household_members`
  ADD CONSTRAINT `fk_household_members_household` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_household_members_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  ADD CONSTRAINT `fk_service_beneficiaries_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_service_beneficiaries_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `time_log`
--
ALTER TABLE `time_log`
  ADD CONSTRAINT `fk_time_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
