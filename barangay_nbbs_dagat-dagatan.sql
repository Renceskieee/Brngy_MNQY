-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 29, 2025 at 09:22 AM
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
(2, '/uploads/personalisation/images/carousel-1766636186725-314149602.jpg', 3, '2025-12-25 04:16:26'),
(3, '/uploads/personalisation/images/carousel-1766636190716-534270392.jpg', 2, '2025-12-25 04:16:30'),
(4, '/uploads/personalisation/images/carousel-1766636197294-357738198.jpg', 1, '2025-12-25 04:16:37'),
(6, '/uploads/personalisation/images/carousel-1766647589055-259286283.jpeg', 5, '2025-12-25 07:26:29'),
(7, '/uploads/personalisation/images/carousel-1766647603575-556339110.jpg', 6, '2025-12-25 07:26:43');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `household_id` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `user_id`, `resident_id`, `household_id`, `description`, `timestamp`) VALUES
(1, 1, NULL, NULL, 'Deleted resident: Chua, Michael Tan', '2025-12-28 05:32:28'),
(2, 1, NULL, NULL, 'Deleted resident: Uy, Jasmine Lee', '2025-12-28 05:32:42'),
(3, 1, 28, NULL, 'Added new resident: Navarrosa, Angela Tanya Galera', '2025-12-29 05:54:46'),
(4, 1, NULL, 1, 'Added new household: Navarrosa Residence', '2025-12-29 07:03:06'),
(5, 1, NULL, 1, 'Deleted household: Navarrosa Residence', '2025-12-29 07:03:58'),
(6, 1, NULL, 2, 'Added new household: Navarrosa Residence', '2025-12-29 07:05:09');

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
(1, 'Reyes Family', 'Blk 1 Lot 2 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(2, 'Navarrosa Family', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-29 07:05:09', '2025-12-29 07:21:30'),
(3, 'Cruz Family', 'Blk 3 Lot 8 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(4, 'Garcia Family', 'Blk 4 Lot 1 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(5, 'Dela Rosa Family', 'Blk 5 Lot 3 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(6, 'Mendoza Family', 'Blk 6 Lot 4 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(7, 'Flores Family', 'Blk 7 Lot 6 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(8, 'Ramos Family', 'Blk 8 Lot 7 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(9, 'Aquino Family', 'Blk 9 Lot 9 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(10, 'Navarro Family', 'Blk 10 Lot 2 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(11, 'Torres Family', 'Blk 11 Lot 1 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(12, 'Castillo Family', 'Blk 12 Lot 5 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(13, 'Villanueva Family', 'Blk 13 Lot 3 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(14, 'Morales Family', 'Blk 14 Lot 4 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(15, 'Padilla Family', 'Blk 15 Lot 6 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12'),
(16, 'Santos Family', 'Blk 2 Lot 5 Dagat-Dagatan', '2025-12-29 07:21:12', '2025-12-29 07:21:12');

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
(3, 2, 28, 'member', '2025-12-29 07:21:30'),
(4, 9, 8, 'dependent', '2025-12-29 07:27:16'),
(9, 1, 29, 'head', '2025-12-29 07:28:43'),
(10, 1, 30, 'member', '2025-12-29 07:28:43'),
(11, 1, 2, 'member', '2025-12-29 07:28:43'),
(12, 1, 31, 'member', '2025-12-29 07:28:43');

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
(1, '/uploads/logo/logo-1766647338113-775837713.png', '/uploads/personalisation/background/main_bg-1766650002303-317238879.jpg', 'SK Barangay Information System - Brgy. Dagat-Dagatan', '#FFC300', 'SK Barangay Information System 2025', '#FFC300', '#000000', '#ECECEC', '#5463FF', '#5463FF', '2025-12-28 05:26:13');

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
  `civil_status` enum('single','married','widowed','separated','divorced') NOT NULL,
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
(1, 'Juan', 'Santos', 'Dela Cruz', 'NA', 'male', '1990-01-05', 'single', '09180000001', 'resident01@email.com', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(2, 'Maria', 'Lopez', 'Reyes', 'NA', 'female', '1988-02-10', 'married', '09180000002', 'resident02@email.com', 'Purok 2, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(3, 'Jose', 'Garcia', 'Mendoza', 'Jr.', 'male', '1995-03-15', 'single', '09180000003', 'resident03@email.com', 'Purok 3, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(4, 'Ana', 'Torres', 'Villanueva', 'NA', 'female', '1992-04-20', 'single', '09180000004', 'resident04@email.com', 'Purok 4, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(5, 'Mark', 'Cruz', 'Santos', 'NA', 'male', '1985-05-25', 'married', '09180000005', 'resident05@email.com', 'Purok 5, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(6, 'Grace', 'Flores', 'Navarro', 'NA', 'female', '1998-06-01', 'single', '09180000006', 'resident06@email.com', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(7, 'Paul', 'Andres', 'Lim', 'NA', 'male', '1991-07-07', 'single', '09180000007', 'resident07@email.com', 'Purok 2, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(8, 'Christine', 'Mae', 'Aquino', 'NA', 'female', '1987-08-12', 'married', '09180000008', 'resident08@email.com', 'Purok 3, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(9, 'Daniel', 'Reyes', 'Cortez', 'II', 'male', '2000-09-18', 'single', '09180000009', 'resident09@email.com', 'Purok 4, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(10, 'Elaine', 'Joy', 'Pascual', 'NA', 'female', '1994-10-22', 'single', '09180000010', 'resident10@email.com', 'Purok 5, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(13, 'Ramon', 'Diaz', 'Castillo', 'Sr.', 'male', '1975-01-14', 'married', '09180000013', 'resident13@email.com', 'Purok 2, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(14, 'Sofia', 'Anne', 'Morales', 'NA', 'female', '2001-02-19', 'single', '09180000014', 'resident14@email.com', 'Purok 3, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(15, 'Kevin', 'James', 'Ortega', 'NA', 'male', '1993-03-24', 'single', '09180000015', 'resident15@email.com', 'Purok 4, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(16, 'Patricia', 'Rose', 'Valdez', 'NA', 'female', '1989-04-29', 'married', '09180000016', 'resident16@email.com', 'Purok 5, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(17, 'Leonard', 'Paul', 'Quizon', 'NA', 'male', '1997-05-06', 'single', '09180000017', 'resident17@email.com', 'Purok 6, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(18, 'Monica', 'Faith', 'Ramos', 'NA', 'female', '1990-06-11', 'widowed', '09180000018', 'resident18@email.com', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(19, 'Arvin', 'Kyle', 'Bautista', 'NA', 'male', '1999-07-16', 'single', '09180000019', 'resident19@email.com', 'Purok 2, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(20, 'Liza', 'Mae', 'Fernandez', 'NA', 'female', '1986-08-21', 'separated', '09180000020', 'resident20@email.com', 'Purok 3, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(21, 'Noel', 'Ryan', 'Salazar', 'NA', 'male', '1992-09-01', 'single', '09180000021', 'resident21@email.com', 'Purok 4, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(22, 'Angela', 'Joy', 'Cabrera', 'NA', 'female', '1994-10-02', 'single', '09180000022', 'resident22@email.com', 'Purok 5, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(23, 'Dennis', 'Mark', 'Rosales', 'NA', 'male', '1987-11-03', 'married', '09180000023', 'resident23@email.com', 'Purok 6, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(24, 'Camille', 'Grace', 'Luna', 'NA', 'female', '1998-12-04', 'single', '09180000024', 'resident24@email.com', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(25, 'Bryan', 'Paul', 'Ilagan', 'NA', 'male', '1991-01-05', 'single', '09180000025', 'resident25@email.com', 'Purok 2, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(26, 'Roland', 'Miguel', 'Peralta', 'NA', 'male', '1984-09-14', 'married', '09180000099', 'resident99@email.com', 'Purok 6, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(27, 'Aileen', 'Joy', 'Samson', 'NA', 'female', '1990-10-15', 'single', '09180000100', 'resident100@email.com', 'Purok 7, Barangay Dagat-Dagatan', '2025-12-28 05:31:47', '2025-12-28 05:31:47'),
(28, 'Angela Tanya', 'Galera', 'Navarrosa', 'NA', 'female', '2003-10-31', 'single', '09942611480', 'navarrosa.at.bsinfotech@gmail.com', 'Purok 1, Barangay Dagat-Dagatan', '2025-12-29 05:54:46', '2025-12-29 05:55:05'),
(29, 'Juan', 'Santos', 'Reyes', 'NA', 'male', '1978-03-12', 'married', '09170000001', 'juan.reyes@mail.com', 'Blk 1 Lot 2 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(30, 'Maria', 'Lopez', 'Reyes', 'NA', 'female', '1980-07-19', 'married', '09170000002', 'maria.reyes@mail.com', 'Blk 1 Lot 2 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(31, 'Paolo', 'Maria', 'Reyes', 'NA', 'male', '2006-01-25', 'single', '09170000003', 'paolo.reyes@mail.com', 'Blk 1 Lot 2 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(32, 'Carlos', 'Diaz', 'Santos', 'NA', 'male', '1975-05-10', 'married', '09170000004', 'carlos.santos@mail.com', 'Blk 2 Lot 5 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(33, 'Ana', 'Cruz', 'Santos', 'NA', 'female', '1979-09-02', 'married', '09170000005', 'ana.santos@mail.com', 'Blk 2 Lot 5 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(34, 'Miguel', 'Ana', 'Santos', 'NA', 'male', '2008-06-18', 'single', '09170000006', 'miguel.santos@mail.com', 'Blk 2 Lot 5 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(35, 'Roberto', 'Gomez', 'Cruz', 'NA', 'male', '1972-11-14', 'married', '09170000007', 'roberto.cruz@mail.com', 'Blk 3 Lot 8 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(36, 'Elena', 'Reyes', 'Cruz', 'NA', 'female', '1974-02-20', 'married', '09170000008', 'elena.cruz@mail.com', 'Blk 3 Lot 8 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(37, 'Antonio', 'Perez', 'Garcia', 'NA', 'male', '1981-08-09', 'married', '09170000009', 'antonio.garcia@mail.com', 'Blk 4 Lot 1 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(38, 'Liza', 'Flores', 'Garcia', 'NA', 'female', '1983-12-01', 'married', '09170000010', 'liza.garcia@mail.com', 'Blk 4 Lot 1 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(39, 'Angela', 'Liza', 'Garcia', 'NA', 'female', '2010-05-11', 'single', '09170000011', 'angela.garcia@mail.com', 'Blk 4 Lot 1 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(40, 'Pedro', 'Ramos', 'Dela Rosa', 'NA', 'male', '1976-04-22', 'married', '09170000012', 'pedro.delarosa@mail.com', 'Blk 5 Lot 3 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(41, 'Grace', 'Lim', 'Dela Rosa', 'NA', 'female', '1979-10-15', 'married', '09170000013', 'grace.delarosa@mail.com', 'Blk 5 Lot 3 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(42, 'Marco', 'Villanueva', 'Mendoza', 'NA', 'male', '1985-01-08', 'married', '09170000014', 'marco.mendoza@mail.com', 'Blk 6 Lot 4 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(43, 'Jenna', 'Torres', 'Mendoza', 'NA', 'female', '1987-03-27', 'married', '09170000015', 'jenna.mendoza@mail.com', 'Blk 6 Lot 4 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(44, 'Kyle', 'Marco', 'Mendoza', 'NA', 'male', '2012-09-30', 'single', '09170000016', 'kyle.mendoza@mail.com', 'Blk 6 Lot 4 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(45, 'Rafael', 'Aquino', 'Flores', 'NA', 'male', '1980-06-05', 'married', '09170000017', 'rafael.flores@mail.com', 'Blk 7 Lot 6 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(46, 'Nina', 'Santos', 'Flores', 'NA', 'female', '1982-11-23', 'married', '09170000018', 'nina.flores@mail.com', 'Blk 7 Lot 6 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(47, 'Jose', 'Navarro', 'Ramos', 'NA', 'male', '1974-02-17', 'married', '09170000019', 'jose.ramos@mail.com', 'Blk 8 Lot 7 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47'),
(48, 'Cathy', 'Lopez', 'Ramos', 'NA', 'female', '1977-07-28', 'married', '09170000020', 'cathy.ramos@mail.com', 'Blk 8 Lot 7 Dagat-Dagatan', '2025-12-29 07:26:47', '2025-12-29 07:26:47');

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
(1, 2, '2025-12-29 08:05:55', '2025-12-29 00:08:03'),
(2, 2, '2025-12-29 08:14:13', '2025-12-29 00:18:14'),
(3, 2, '2025-12-29 08:21:20', NULL);

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
(1, '224-09160M', '$2b$10$GBrZHG8p5iy8eDWvpBsFnO/DSvn1a9Hqe.bMtGWl.YAGwfEOzihme', 'Laurence Paul', 'Quiniano', 'quiniano.lp.bsinfotech@gmail.com', '9946085013', '/uploads/profile/profile-1766995571609-535811446.png', 'admin', 'active', '2025-12-12 06:45:59', '2025-12-29 08:06:11'),
(2, '224-09159M', '$2b$10$9DooDXwNMs.CgzqC17S1oO6B1r8DDDtvlIHVWkSPbC/7VxbVV86Hu', 'Angela Tanya', 'Navarrosa', 'quiniano.infotech@gmail.com', '9942611480', NULL, 'staff', 'active', '2025-12-12 06:59:37', '2025-12-19 07:49:40'),
(3, '224-09127M', '$2b$10$ZXQXYdD1FrT5PeZbP3s.LejOyPRgVNyAbmOOVsxe80BiXQh/TC2di', 'Laurence', 'Quiniano', 'quiniano.lp@gmail.com', '9685408094', NULL, 'staff', 'active', '2025-12-12 09:34:10', '2025-12-12 09:34:10'),
(4, '224-09162M', '$2b$10$jOyISqnx6L1.6UJ/FnXuTOYEm63MvRkZU.5jjA2khC2NDENcF9mgW', 'Laurence Paul', 'Quiniano', 'laurencequiniano74@gmail.com', '9156128497', NULL, 'staff', 'active', '2025-12-12 09:46:28', '2025-12-12 09:46:28'),
(5, '224-09161M', '$2b$10$x6F.uueozDp.8.BJhwQyUu3Nrcn.wUFph.BQCSmeNfl7yAjjUl.he', 'Aaliyah Paula', 'Quiniano', 'arvin.quiniano.abc@gmail.com', '9685408094', NULL, 'staff', 'active', '2025-12-19 08:31:22', '2025-12-19 08:31:22');

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
  ADD KEY `fk_history_resident` (`resident_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `households`
--
ALTER TABLE `households`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `household_members`
--
ALTER TABLE `household_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `time_log`
--
ALTER TABLE `time_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `fk_history_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `household_members`
--
ALTER TABLE `household_members`
  ADD CONSTRAINT `fk_household_members_household` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_household_members_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `time_log`
--
ALTER TABLE `time_log`
  ADD CONSTRAINT `fk_time_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
