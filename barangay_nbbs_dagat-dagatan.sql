-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 07:20 AM
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

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `user_id`, `resident_id`, `household_id`, `incident_id`, `service_id`, `description`, `timestamp`) VALUES
(1, 1, NULL, NULL, NULL, 8, 'Updated service: Free Printing Service for Students', '2026-01-05 02:52:08'),
(2, 1, NULL, NULL, NULL, 6, 'Updated service: Digital Literacy Workshop', '2026-01-05 02:52:19'),
(3, 1, NULL, NULL, NULL, 6, 'Updated service: Digital Literacy Workshop', '2026-01-05 12:24:59'),
(4, 1, NULL, NULL, NULL, 20, 'Updated service: Zumba for Youth Fitness', '2026-01-07 12:32:35'),
(5, 1, 103, NULL, NULL, NULL, 'Added new resident: Quiniano, Laurence Paul Galvan', '2026-01-13 12:16:37'),
(6, 1, NULL, 34, NULL, NULL, 'Added new household: Quiniano Residence', '2026-01-13 12:17:34'),
(7, 1, NULL, 34, NULL, NULL, 'Updated household: Quiniano Residence', '2026-01-13 12:17:58'),
(8, 1, NULL, NULL, 42, NULL, 'Updated incident: INC-2026-000042', '2026-01-13 12:18:42'),
(9, 1, 103, NULL, NULL, 8, 'Added resident Laurence Paul Quiniano as beneficiary to service: Free Printing Service for Students', '2026-01-13 12:19:32'),
(10, 1, 104, NULL, NULL, NULL, 'Added new resident: Marin, Febrich Faith', '2026-01-18 04:45:27'),
(11, 1, NULL, 35, NULL, NULL, 'Added new household: Marin Residence', '2026-01-18 04:46:36'),
(12, 1, NULL, 35, NULL, NULL, 'Updated household: Marin Residence', '2026-01-18 04:46:56'),
(13, 1, NULL, NULL, 39, NULL, 'Updated incident: INC-2026-000039', '2026-01-18 04:48:11'),
(14, 1, 43, NULL, NULL, 8, 'Added resident Nilo Flores as beneficiary to service: Free Printing Service for Students', '2026-01-18 04:49:10'),
(15, 1, 42, NULL, NULL, 8, 'Added resident Mina Flores as beneficiary to service: Free Printing Service for Students', '2026-01-18 04:49:11'),
(16, 1, 105, NULL, NULL, NULL, 'Added new resident: Quiniano, Pau', '2026-01-18 05:50:21'),
(17, 1, 105, NULL, NULL, NULL, 'Updated resident: Quiniano, Pau', '2026-01-18 05:50:42'),
(18, 1, 106, NULL, NULL, NULL, 'Added new resident: Quiniano, Rency', '2026-01-18 05:51:22'),
(19, 1, NULL, NULL, NULL, 23, 'Added new service: Testing Email', '2026-01-18 05:52:45'),
(20, 1, 105, NULL, NULL, 23, 'Added resident Pau Quiniano as beneficiary to service: Testing Email', '2026-01-18 05:53:05'),
(21, 1, 103, NULL, NULL, 23, 'Added resident Laurence Paul Quiniano as beneficiary to service: Testing Email', '2026-01-18 05:53:05'),
(22, 1, 106, NULL, NULL, 23, 'Added resident Rency Quiniano as beneficiary to service: Testing Email', '2026-01-18 05:53:05'),
(23, 1, NULL, NULL, NULL, 23, 'Removed resident Rency Quiniano from service beneficiaries: Testing Email', '2026-01-18 05:55:41'),
(24, 1, 106, NULL, NULL, 23, 'Added resident Rency Quiniano as beneficiary to service: Testing Email', '2026-01-18 05:57:38'),
(25, 1, 107, NULL, NULL, NULL, 'Added new resident: Navarrosa, Angela Tanya Galera', '2026-01-18 05:59:38'),
(26, 1, 107, NULL, NULL, 17, 'Added resident Angela Tanya Navarrosa as beneficiary to service: Feeding Program for Kids', '2026-01-18 05:59:53'),
(27, 1, 103, NULL, NULL, 17, 'Added resident Laurence Paul Quiniano as beneficiary to service: Feeding Program for Kids', '2026-01-18 06:01:13');

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
(1, 'Dela Cruz Family', 'Phase 1, Block 2, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(2, 'Garcia Family', 'Phase 1, Block 3, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(3, 'Bautista Family', 'Phase 1, Block 5, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(4, 'Reyes Family', 'Phase 2, Block 1, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(5, 'Santos Family', 'Phase 2, Block 4, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(6, 'Mendoza Family', 'Phase 3, Block 2, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(7, 'Pascual Family', 'Phase 3, Block 10, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(8, 'Aquino Family', 'Letre Road, Corner Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(9, 'Villanueva Family', 'Phase 4, Block 1, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(10, 'Torres Family', 'Phase 4, Block 5, Dagat-Dagatan', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(11, 'Lumibao Family', 'Phase 1, Block 12, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(12, 'Dizon Family', 'Phase 2, Block 8, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(13, 'Castro Family', 'Phase 3, Block 15, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(14, 'Flores Family', 'Phase 1, Block 20, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(15, 'Ramos Family', 'Phase 4, Block 12, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(16, 'Santiago Family', 'Phase 2, Block 14, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(17, 'Espiritu Family', 'Phase 1, Block 7, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(18, 'Marquez Family', 'Phase 3, Block 5, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(19, 'Sarmiento Family', 'Phase 2, Block 3, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(20, 'Navarro Family', 'Phase 4, Block 9, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(21, 'Corpuz Family', 'Phase 1, Block 11, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(22, 'Ferrer Family', 'Phase 3, Block 22, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(23, 'Cruz Family', 'Phase 2, Block 6, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(24, 'Padilla Family', 'Phase 1, Block 9, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(25, 'Bernardo Family', 'Phase 4, Block 3, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(26, 'Tolentino Family', 'Phase 2, Block 11, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(27, 'Gomez Family', 'Phase 3, Block 8, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(28, 'Domingo Family', 'Phase 1, Block 15, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(29, 'Valenzuela Family', 'Phase 4, Block 7, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(30, 'Salvador Family', 'Phase 2, Block 19, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(31, 'Mercado Family', 'Phase 3, Block 12, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(32, 'Rivera Family', 'Phase 1, Block 4, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(33, 'Quinto Family', 'Phase 4, Block 2, NBBS', '2026-01-03 05:05:59', '2026-01-03 05:05:59'),
(34, 'Quiniano Residence', 'Brgy. NBBS Dagat-Dagatan', '2026-01-13 12:17:34', '2026-01-13 12:17:34'),
(35, 'Marin Residence', 'Blk 1 Lot 12 NBBS Dagat-Dagatan', '2026-01-18 04:46:36', '2026-01-18 04:46:36');

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
(1, 1, 1, 'head', '2026-01-03 05:08:03'),
(2, 1, 2, 'member', '2026-01-03 05:08:03'),
(3, 1, 3, 'member', '2026-01-03 05:08:03'),
(4, 1, 4, 'dependent', '2026-01-03 05:08:03'),
(5, 2, 5, 'head', '2026-01-03 05:08:03'),
(6, 2, 6, 'member', '2026-01-03 05:08:03'),
(7, 2, 7, 'dependent', '2026-01-03 05:08:03'),
(8, 3, 8, 'head', '2026-01-03 05:08:03'),
(9, 3, 9, 'member', '2026-01-03 05:08:03'),
(10, 3, 10, 'member', '2026-01-03 05:08:03'),
(11, 4, 11, 'head', '2026-01-03 05:08:03'),
(12, 4, 12, 'member', '2026-01-03 05:08:03'),
(13, 4, 13, 'dependent', '2026-01-03 05:08:03'),
(14, 5, 14, 'head', '2026-01-03 05:08:03'),
(15, 5, 15, 'member', '2026-01-03 05:08:03'),
(16, 5, 16, 'member', '2026-01-03 05:08:03'),
(17, 5, 17, 'member', '2026-01-03 05:08:03'),
(18, 6, 18, 'head', '2026-01-03 05:08:03'),
(19, 6, 19, 'member', '2026-01-03 05:08:03'),
(20, 6, 20, 'dependent', '2026-01-03 05:08:03'),
(21, 7, 21, 'head', '2026-01-03 05:08:03'),
(22, 7, 22, 'member', '2026-01-03 05:08:03'),
(23, 7, 23, 'member', '2026-01-03 05:08:03'),
(24, 8, 24, 'head', '2026-01-03 05:08:03'),
(25, 8, 25, 'member', '2026-01-03 05:08:03'),
(26, 8, 26, 'member', '2026-01-03 05:08:03'),
(27, 9, 27, 'head', '2026-01-03 05:08:03'),
(28, 9, 28, 'member', '2026-01-03 05:08:03'),
(29, 9, 29, 'dependent', '2026-01-03 05:08:03'),
(30, 10, 30, 'head', '2026-01-03 05:08:03'),
(31, 10, 31, 'member', '2026-01-03 05:08:03'),
(32, 10, 32, 'dependent', '2026-01-03 05:08:03'),
(33, 11, 33, 'head', '2026-01-03 05:08:03'),
(34, 11, 34, 'member', '2026-01-03 05:08:03'),
(35, 11, 35, 'member', '2026-01-03 05:08:03'),
(36, 12, 36, 'head', '2026-01-03 05:08:03'),
(37, 12, 37, 'member', '2026-01-03 05:08:03'),
(38, 12, 38, 'dependent', '2026-01-03 05:08:03'),
(39, 13, 39, 'head', '2026-01-03 05:08:03'),
(40, 13, 40, 'member', '2026-01-03 05:08:03'),
(41, 13, 41, 'dependent', '2026-01-03 05:08:03'),
(42, 14, 42, 'head', '2026-01-03 05:08:03'),
(43, 14, 43, 'member', '2026-01-03 05:08:03'),
(44, 14, 44, 'dependent', '2026-01-03 05:08:03'),
(45, 15, 45, 'head', '2026-01-03 05:08:03'),
(46, 15, 46, 'member', '2026-01-03 05:08:03'),
(47, 15, 47, 'member', '2026-01-03 05:08:03'),
(48, 16, 48, 'head', '2026-01-03 05:08:03'),
(49, 16, 49, 'member', '2026-01-03 05:08:03'),
(50, 16, 50, 'dependent', '2026-01-03 05:08:03'),
(51, 17, 51, 'head', '2026-01-03 05:08:03'),
(52, 17, 52, 'member', '2026-01-03 05:08:03'),
(53, 17, 53, 'member', '2026-01-03 05:08:03'),
(54, 18, 54, 'head', '2026-01-03 05:08:03'),
(55, 18, 55, 'member', '2026-01-03 05:08:03'),
(56, 18, 56, 'dependent', '2026-01-03 05:08:03'),
(57, 19, 57, 'head', '2026-01-03 05:08:03'),
(58, 19, 58, 'member', '2026-01-03 05:08:03'),
(59, 19, 59, 'dependent', '2026-01-03 05:08:03'),
(60, 20, 60, 'head', '2026-01-03 05:08:03'),
(61, 20, 61, 'member', '2026-01-03 05:08:03'),
(62, 20, 62, 'dependent', '2026-01-03 05:08:03'),
(63, 21, 63, 'head', '2026-01-03 05:08:03'),
(64, 21, 64, 'member', '2026-01-03 05:08:03'),
(65, 21, 65, 'dependent', '2026-01-03 05:08:03'),
(66, 22, 66, 'head', '2026-01-03 05:08:03'),
(67, 22, 67, 'member', '2026-01-03 05:08:03'),
(68, 22, 68, 'dependent', '2026-01-03 05:08:03'),
(69, 23, 69, 'head', '2026-01-03 05:08:03'),
(70, 23, 70, 'member', '2026-01-03 05:08:03'),
(71, 23, 71, 'dependent', '2026-01-03 05:08:03'),
(72, 24, 72, 'head', '2026-01-03 05:08:03'),
(73, 24, 73, 'member', '2026-01-03 05:08:03'),
(74, 24, 74, 'member', '2026-01-03 05:08:03'),
(75, 25, 75, 'head', '2026-01-03 05:08:03'),
(76, 25, 76, 'member', '2026-01-03 05:08:03'),
(77, 25, 77, 'dependent', '2026-01-03 05:08:03'),
(78, 26, 78, 'head', '2026-01-03 05:08:03'),
(79, 26, 79, 'member', '2026-01-03 05:08:03'),
(80, 26, 80, 'member', '2026-01-03 05:08:03'),
(81, 27, 81, 'head', '2026-01-03 05:08:03'),
(82, 27, 82, 'member', '2026-01-03 05:08:03'),
(83, 27, 83, 'dependent', '2026-01-03 05:08:03'),
(84, 28, 84, 'head', '2026-01-03 05:08:03'),
(85, 28, 85, 'member', '2026-01-03 05:08:03'),
(86, 28, 86, 'dependent', '2026-01-03 05:08:03'),
(87, 29, 87, 'head', '2026-01-03 05:08:03'),
(88, 29, 88, 'member', '2026-01-03 05:08:03'),
(89, 29, 89, 'dependent', '2026-01-03 05:08:03'),
(90, 30, 90, 'head', '2026-01-03 05:08:03'),
(91, 30, 91, 'member', '2026-01-03 05:08:03'),
(92, 30, 92, 'member', '2026-01-03 05:08:03'),
(93, 31, 93, 'head', '2026-01-03 05:08:03'),
(94, 31, 94, 'member', '2026-01-03 05:08:03'),
(95, 31, 95, 'dependent', '2026-01-03 05:08:03'),
(96, 32, 96, 'head', '2026-01-03 05:08:03'),
(97, 32, 97, 'member', '2026-01-03 05:08:03'),
(98, 32, 98, 'dependent', '2026-01-03 05:08:03'),
(99, 33, 99, 'head', '2026-01-03 05:08:03'),
(100, 33, 100, 'member', '2026-01-03 05:08:03'),
(101, 34, 103, 'head', '2026-01-13 12:17:58'),
(102, 35, 104, 'dependent', '2026-01-18 04:46:55');

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
(23, 'INC-2026-000023', 'Curfew Violation', 'Phase 1 Park', '2025-11-10', '22:30:00', 'Bgy. Tanod Ramos', 'Group of 5 Minors', 'Minors found loitering past 10 PM curfew without guardians.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(24, 'INC-2026-000024', 'Sports Dispute', 'NBBS Covered Court', '2025-11-12', '16:00:00', 'Juan Dela Cruz Jr.', 'Mark Santos II', 'Physical altercation during a practice basketball game.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(25, 'INC-2026-000025', 'Vandalism', 'Dagat-Dagatan Elem School', '2025-11-15', '03:00:00', 'School Guard', 'Unknown Youth', 'Graffiti found on the newly painted perimeter fence.', 'pending', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(26, 'INC-2026-000026', 'Noise Complaint', 'Phase 3, Block 10', '2025-11-18', '23:15:00', 'Maria Dela Cruz', 'Local Youth Group', 'Excessive noise from a mobile karaoke machine late at night.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(27, 'INC-2026-000027', 'Littering', 'Phase 2 Plaza', '2025-11-20', '17:30:00', 'Sanitation Officer', 'Skaters Group', 'Food waste scattered after a skateboarding session.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(28, 'INC-2026-000028', 'Cyber-Bullying', 'Online/Social Media', '2025-11-22', '09:00:00', 'Student Resident', 'Classmate Resident', 'Defamatory posts circulated in the local youth community group.', 'ongoing', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(29, 'INC-2026-000029', 'Illegal Gambling', 'Phase 3 Backlot', '2025-11-25', '15:20:00', 'Concerned Parent', 'Group of Teenagers', 'Card games involving money reported behind the hall.', 'ongoing', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(30, 'INC-2026-000030', 'Physical Scuffle', 'Letre Road Store', '2025-11-28', '19:45:00', 'Store Owner', 'Two Male Juveniles', 'Argument over a small debt leading to a minor scuffle.', 'dismissed', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(31, 'INC-2026-000031', 'Equipment Damage', 'SK Office Gym', '2025-12-01', '11:00:00', 'SK Sports Coord', 'Resident User', 'Broken treadmill belt due to improper use and horseplay.', 'pending', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(32, 'INC-2026-000032', 'Disorderly Conduct', 'Barangay Hall Entrance', '2025-12-03', '13:00:00', 'Frontline Staff', 'Aggressive Youth', 'Individual shouting regarding a delayed SK ID application.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(33, 'INC-2026-000033', 'Theft (Minor)', 'Phase 2 Court', '2025-12-05', '18:15:00', 'Visitor Player', 'Unidentified Resident', 'Reported missing smartphone left on the bleachers.', 'ongoing', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(34, 'INC-2026-000034', 'Facility Misuse', 'Phase 1 Computer Lab', '2025-12-07', '15:00:00', 'Lab Instructor', 'Three Students', 'Accessing restricted/explicit websites during study hours.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(35, 'INC-2026-000035', 'Smoking Violation', 'Park Perimeter', '2025-12-10', '16:30:00', 'Health Worker', 'Minor Resident', 'Minor caught using e-cigarettes/vape in a public zone.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(36, 'INC-2026-000036', 'Verbal Abuse', 'SK Sports Center', '2025-12-12', '16:00:00', 'Referee', 'Player Parent', 'Parent insulting the youth referee during a match.', 'dismissed', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(37, 'INC-2026-000037', 'Loitering (Class Hours)', 'Phase 2 Alley', '2025-12-15', '10:30:00', 'Concerned Citizen', 'High School Students', 'Students in uniform seen at a billiards hall during school hours.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(38, 'INC-2026-000038', 'Public Intoxication', 'Phase 3 Plaza', '2025-12-18', '22:15:00', 'Patrol Officer', '21-Year-Old Male', 'Individual found sleeping on a bench heavily intoxicated.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(39, 'INC-2026-000039', 'Conflict of Interest', 'SK Council Room', '2025-12-20', '14:00:00', 'SK Kagawad', 'SK Treasurer', 'Dispute over the allocation of funds for Christmas event.', 'resolved', '2026-01-03 08:42:05', '2026-01-18 04:48:11'),
(40, 'INC-2026-000040', 'Unauthorized Solicitation', 'Phase 4 Residences', '2025-12-22', '10:00:00', 'Homeowner Association', 'Youth Organization', 'Group using the SK name to solicit funds without permit.', 'dismissed', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(41, 'INC-2026-000041', 'Nuisance Driving', 'Main Road', '2025-12-24', '21:00:00', 'Night Worker', 'Riders', 'Loud motorcycle exhausts causing sleep disturbance.', 'pending', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(42, 'INC-2026-000042', 'Theft (School Supplies)', 'Phase 1, Block 2', '2025-12-26', '08:00:00', 'Parent', 'Neighbor Youth', 'Theft of school bags left outside the house.', 'resolved', '2026-01-03 08:42:05', '2026-01-13 12:18:42'),
(43, 'INC-2026-000043', 'Park Disturbance', 'Phase 3 Park', '2025-12-28', '20:00:00', 'Resident', 'Teenage Group', 'Group of teenagers shouting and causing distress to seniors.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05'),
(44, 'INC-2026-000044', 'Missing Person', 'Phase 4, Block 12', '2025-12-30', '08:00:00', 'Parent', '16-Year-Old Female', 'Minor failed to return home after a school project.', 'resolved', '2026-01-03 08:42:05', '2026-01-03 08:42:05');

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
(1, '/uploads/logo/logo-1766647338113-775837713.png', '/uploads/personalisation/background/main_bg-1766650002303-317238879.jpg', 'SK Barangay Information System - Brgy. Dagat-Dagatan', '#FFE52A', 'SK Barangay Information System 2025', '#FFE52A', '#000000', '#ECECEC', '#FF1818', '#FF1818', '2026-01-03 04:36:18');

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
  `civil_status` enum('single','married','widowed','separated','annulled','divorced','live-in','unknown') NOT NULL,
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
(1, 'Juan', 'Ponce', 'Dela Cruz', 'Sr.', 'male', '1975-05-12', 'married', '09170000001', 'juan.dc@email.com', 'Phase 1, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(2, 'Maria', 'Santos', 'Dela Cruz', 'NA', 'female', '1978-08-20', 'married', '09170000002', 'maria.dc@email.com', 'Phase 1, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(3, 'Juan', 'Santos', 'Dela Cruz', 'Jr.', 'male', '2005-01-15', 'single', '09170000003', 'juanjr.dc@email.com', 'Phase 1, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(4, 'Elena', 'Santos', 'Dela Cruz', 'NA', 'female', '2010-03-22', 'single', NULL, NULL, 'Phase 1, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(5, 'Ricardo', 'Luna', 'Garcia', 'NA', 'male', '1980-11-02', 'married', '09170000004', 'ricardo.g@email.com', 'Phase 1, Block 3, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(6, 'Liza', 'Mendoza', 'Garcia', 'NA', 'female', '1982-04-14', 'married', '09170000005', 'liza.g@email.com', 'Phase 1, Block 3, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(7, 'Paolo', 'Mendoza', 'Garcia', 'III', 'male', '2012-06-30', 'single', NULL, NULL, 'Phase 1, Block 3, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(8, 'Antonio', 'Reyes', 'Bautista', 'NA', 'male', '1965-09-12', 'widowed', '09170000006', 'antonio.b@email.com', 'Phase 1, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(9, 'Christina', 'Reyes', 'Bautista', 'NA', 'female', '1990-12-25', 'single', '09170000007', 'chris.b@email.com', 'Phase 1, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(10, 'Marco', 'Reyes', 'Bautista', 'NA', 'male', '1995-05-05', 'single', '09170000008', 'marco.b@email.com', 'Phase 1, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(11, 'Roberto', 'C', 'Reyes', 'NA', 'male', '1988-02-14', 'married', '09170000009', 'robert.reyes@email.com', 'Phase 2, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(12, 'Gina', 'S', 'Reyes', 'NA', 'female', '1990-05-10', 'married', '09170000010', 'gina.reyes@email.com', 'Phase 2, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(13, 'Angelico', 'S', 'Reyes', 'NA', 'male', '2015-08-12', 'single', NULL, NULL, 'Phase 2, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(14, 'Fernando', 'B', 'Santos', 'NA', 'male', '1970-01-01', 'married', '09170000011', 'fernand.s@email.com', 'Phase 2, Block 4, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(15, 'Lucia', 'V', 'Santos', 'NA', 'female', '1972-02-02', 'married', '09170000012', 'lucia.s@email.com', 'Phase 2, Block 4, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(16, 'Mark', 'V', 'Santos', 'II', 'male', '1998-03-03', 'single', '09170000013', 'mark.s@email.com', 'Phase 2, Block 4, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(17, 'Ana', 'V', 'Santos', 'NA', 'female', '2001-04-04', 'single', '09170000014', 'ana.s@email.com', 'Phase 2, Block 4, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(18, 'Mateo', 'G', 'Mendoza', 'NA', 'male', '1985-07-07', 'separated', '09170000015', 'mateo.m@email.com', 'Phase 3, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(19, 'Sonia', 'L', 'Mendoza', 'NA', 'female', '1987-01-15', 'separated', '09170000016', 'sonia.m@email.com', 'Phase 3, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(20, 'Lucas', 'L', 'Mendoza', 'NA', 'male', '2010-09-09', 'single', NULL, NULL, 'Phase 3, Block 2, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(21, 'Sofia', 'L', 'Pascual', 'NA', 'female', '1992-08-08', 'single', '09170000017', 'sofia.p@email.com', 'Phase 3, Block 10, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(22, 'Pedro', 'L', 'Pascual', 'Sr.', 'male', '1960-05-05', 'married', '09170000018', 'pedro.p@email.com', 'Phase 3, Block 10, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(23, 'Lorna', 'D', 'Pascual', 'NA', 'female', '1962-10-10', 'married', '09170000019', 'lorna.p@email.com', 'Phase 3, Block 10, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(24, 'Benigno', 'S', 'Aquino', 'III', 'male', '1960-02-08', 'single', '09170000020', 'ben.a@email.com', 'Letre Road, Corner Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(25, 'Kris', 'S', 'Aquino', 'NA', 'female', '1971-02-14', 'annulled', '09170000021', 'kris.a@email.com', 'Letre Road, Corner Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(26, 'Bimby', 'Y', 'Aquino', 'NA', 'male', '2007-04-19', 'single', '09170000022', 'bimby.a@email.com', 'Letre Road, Corner Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(27, 'Teresa', 'M', 'Villanueva', 'NA', 'female', '1983-03-15', 'married', '09170000023', 'teresa.v@email.com', 'Phase 4, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(28, 'Victor', 'M', 'Villanueva', 'Sr.', 'male', '1980-05-20', 'married', '09170000024', 'victor.v@email.com', 'Phase 4, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(29, 'Victor', 'M', 'Villanueva', 'Jr.', 'male', '2015-11-11', 'single', NULL, NULL, 'Phase 4, Block 1, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(30, 'Arturo', 'P', 'Torres', 'NA', 'male', '1977-10-10', 'married', '09170000025', 'art.t@email.com', 'Phase 4, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(31, 'Carla', 'P', 'Torres', 'NA', 'female', '1980-12-12', 'married', '09170000026', 'carla.t@email.com', 'Phase 4, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(32, 'Berto', 'P', 'Torres', 'NA', 'male', '2008-01-01', 'single', NULL, NULL, 'Phase 4, Block 5, Dagat-Dagatan', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(33, 'Dante', 'E', 'Lumibao', 'NA', 'male', '1974-06-06', 'married', '09170000027', 'dante.l@email.com', 'Phase 1, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(34, 'Elsa', 'R', 'Lumibao', 'NA', 'female', '1976-07-07', 'married', '09170000028', 'elsa.l@email.com', 'Phase 1, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(35, 'Fred', 'R', 'Lumibao', 'NA', 'male', '2002-08-08', 'single', '09170000029', 'fred.l@email.com', 'Phase 1, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(36, 'Gregorio', 'H', 'Dizon', 'NA', 'male', '1982-09-09', 'married', '09170000030', 'greg.d@email.com', 'Phase 2, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(37, 'Hilda', 'J', 'Dizon', 'NA', 'female', '1984-10-10', 'married', '09170000031', 'hilda.d@email.com', 'Phase 2, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(38, 'Ian', 'J', 'Dizon', 'NA', 'male', '2014-11-11', 'single', NULL, NULL, 'Phase 2, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(39, 'Jerome', 'K', 'Castro', 'NA', 'male', '1990-12-12', 'married', '09170000032', 'jerome.c@email.com', 'Phase 3, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(40, 'Kathy', 'L', 'Castro', 'NA', 'female', '1992-01-01', 'married', '09170000033', 'kathy.c@email.com', 'Phase 3, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(41, 'Leo', 'L', 'Castro', 'NA', 'male', '2018-02-02', 'single', NULL, NULL, 'Phase 3, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(42, 'Mina', 'N', 'Flores', 'NA', 'female', '1988-03-03', 'married', '09170000034', 'mina.f@email.com', 'Phase 1, Block 20, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(43, 'Nilo', 'O', 'Flores', 'NA', 'male', '1986-04-04', 'married', '09170000035', 'nilo.f@email.com', 'Phase 1, Block 20, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(44, 'Oscar', 'O', 'Flores', 'NA', 'male', '2011-05-05', 'single', NULL, NULL, 'Phase 1, Block 20, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(45, 'Pilar', 'Q', 'Ramos', 'NA', 'female', '1970-06-06', 'widowed', '09170000036', 'pilar.r@email.com', 'Phase 4, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(46, 'Quentin', 'Q', 'Ramos', 'NA', 'male', '1995-07-07', 'single', '09170000037', 'quentin.r@email.com', 'Phase 4, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(47, 'Rina', 'Q', 'Ramos', 'NA', 'female', '1998-08-08', 'single', '09170000038', 'rina.r@email.com', 'Phase 4, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(48, 'Samuel', 'T', 'Santiago', 'NA', 'male', '1980-09-09', 'married', '09170000039', 'sam.s@email.com', 'Phase 2, Block 14, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(49, 'Tanya', 'U', 'Santiago', 'NA', 'female', '1982-10-10', 'married', '09170000040', 'tanya.s@email.com', 'Phase 2, Block 14, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(50, 'Ulysses', 'U', 'Santiago', 'NA', 'male', '2010-11-11', 'single', NULL, NULL, 'Phase 2, Block 14, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(51, 'Victor', 'W', 'Espiritu', 'NA', 'male', '1975-12-12', 'married', '09170000041', 'vic.e@email.com', 'Phase 1, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(52, 'Wilma', 'X', 'Espiritu', 'NA', 'female', '1977-01-01', 'married', '09170000042', 'wilma.e@email.com', 'Phase 1, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(53, 'Xavier', 'X', 'Espiritu', 'NA', 'male', '2005-02-02', 'single', '09170000043', 'xav.e@email.com', 'Phase 1, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(54, 'Yolanda', 'Z', 'Marquez', 'NA', 'female', '1985-03-03', 'married', '09170000044', 'yolanda.m@email.com', 'Phase 3, Block 5, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(55, 'Zack', 'A', 'Marquez', 'NA', 'male', '1983-04-04', 'married', '09170000045', 'zack.m@email.com', 'Phase 3, Block 5, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(56, 'Ariel', 'A', 'Marquez', 'NA', 'male', '2012-05-05', 'single', NULL, NULL, 'Phase 3, Block 5, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(57, 'Bernie', 'C', 'Sarmiento', 'NA', 'male', '1978-06-06', 'married', '09170000046', 'bernie.s@email.com', 'Phase 2, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(58, 'Cely', 'D', 'Sarmiento', 'NA', 'female', '1980-07-07', 'married', '09170000047', 'cely.s@email.com', 'Phase 2, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(59, 'Dindo', 'D', 'Sarmiento', 'NA', 'male', '2008-08-08', 'single', NULL, NULL, 'Phase 2, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(60, 'Efren', 'F', 'Navarro', 'NA', 'male', '1982-09-09', 'married', '09170000048', 'efren.n@email.com', 'Phase 4, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(61, 'Fely', 'G', 'Navarro', 'NA', 'female', '1984-10-10', 'married', '09170000049', 'fely.n@email.com', 'Phase 4, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(62, 'Gino', 'G', 'Navarro', 'NA', 'male', '2015-11-11', 'single', NULL, NULL, 'Phase 4, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(63, 'Hilda', 'I', 'Corpuz', 'NA', 'female', '1990-12-12', 'married', '09170000050', 'hilda.c@email.com', 'Phase 1, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(64, 'Ivan', 'J', 'Corpuz', 'NA', 'male', '1988-01-01', 'married', '09170000051', 'ivan.c@email.com', 'Phase 1, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(65, 'Jade', 'J', 'Corpuz', 'NA', 'female', '2018-02-02', 'single', NULL, NULL, 'Phase 1, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(66, 'Kelly', 'L', 'Ferrer', 'NA', 'female', '1986-03-03', 'married', '09170000052', 'kelly.f@email.com', 'Phase 3, Block 22, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(67, 'Luis', 'M', 'Ferrer', 'NA', 'male', '1984-04-04', 'married', '09170000053', 'luis.f@email.com', 'Phase 3, Block 22, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(68, 'Mona', 'M', 'Ferrer', 'NA', 'female', '2011-05-05', 'single', NULL, NULL, 'Phase 3, Block 22, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(69, 'Nico', 'P', 'Cruz', 'NA', 'male', '1992-06-06', 'married', '09170000054', 'nico.c@email.com', 'Phase 2, Block 6, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(70, 'Oly', 'Q', 'Cruz', 'NA', 'female', '1994-07-07', 'married', '09170000055', 'oly.c@email.com', 'Phase 2, Block 6, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(71, 'Pip', 'Q', 'Cruz', 'NA', 'male', '2019-08-08', 'single', NULL, NULL, 'Phase 2, Block 6, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(72, 'Quiel', 'S', 'Padilla', 'NA', 'male', '1970-09-09', 'married', '09170000056', 'quiel.p@email.com', 'Phase 1, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(73, 'Rina', 'T', 'Padilla', 'NA', 'female', '1972-10-10', 'married', '09170000057', 'rina.p@email.com', 'Phase 1, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(74, 'Seth', 'T', 'Padilla', 'NA', 'male', '2000-11-11', 'single', '09170000058', 'seth.p@email.com', 'Phase 1, Block 9, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(75, 'Tito', 'V', 'Bernardo', 'NA', 'male', '1980-12-12', 'married', '09170000059', 'tito.b@email.com', 'Phase 4, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(76, 'Ula', 'W', 'Bernardo', 'NA', 'female', '1982-01-01', 'married', '09170000060', 'ula.b@email.com', 'Phase 4, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(77, 'Vince', 'W', 'Bernardo', 'NA', 'male', '2010-02-02', 'single', NULL, NULL, 'Phase 4, Block 3, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(78, 'Wally', 'Y', 'Tolentino', 'NA', 'male', '1975-03-03', 'married', '09170000061', 'wally.t@email.com', 'Phase 2, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(79, 'Xena', 'Z', 'Tolentino', 'NA', 'female', '1977-04-04', 'married', '09170000062', 'xena.t@email.com', 'Phase 2, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(80, 'Yuri', 'Z', 'Tolentino', 'NA', 'male', '2005-05-05', 'single', '09170000063', 'yuri.t@email.com', 'Phase 2, Block 11, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(81, 'Zandro', 'B', 'Gomez', 'NA', 'male', '1985-06-06', 'married', '09170000064', 'zandro.g@email.com', 'Phase 3, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(82, 'Alma', 'C', 'Gomez', 'NA', 'female', '1987-07-07', 'married', '09170000065', 'alma.g@email.com', 'Phase 3, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(83, 'Brix', 'C', 'Gomez', 'NA', 'male', '2012-08-08', 'single', NULL, NULL, 'Phase 3, Block 8, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(84, 'Cody', 'E', 'Domingo', 'NA', 'male', '1988-09-09', 'married', '09170000066', 'cody.d@email.com', 'Phase 1, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(85, 'Dora', 'F', 'Domingo', 'NA', 'female', '1990-10-10', 'married', '09170000067', 'dora.d@email.com', 'Phase 1, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(86, 'Erik', 'F', 'Domingo', 'NA', 'male', '2016-11-11', 'single', NULL, NULL, 'Phase 1, Block 15, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(87, 'Fina', 'H', 'Valenzuela', 'NA', 'female', '1982-12-12', 'married', '09170000068', 'fina.v@email.com', 'Phase 4, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(88, 'Gelo', 'I', 'Valenzuela', 'NA', 'male', '1980-01-01', 'married', '09170000069', 'gelo.v@email.com', 'Phase 4, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(89, 'Hana', 'I', 'Valenzuela', 'NA', 'female', '2010-02-02', 'single', NULL, NULL, 'Phase 4, Block 7, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(90, 'Isko', 'K', 'Salvador', 'NA', 'male', '1975-03-03', 'married', '09170000070', 'isko.s@email.com', 'Phase 2, Block 19, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(91, 'Jeni', 'L', 'Salvador', 'NA', 'female', '1977-04-04', 'married', '09170000071', 'jeni.s@email.com', 'Phase 2, Block 19, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(92, 'Kiko', 'L', 'Salvador', 'NA', 'male', '2005-05-05', 'single', '09170000072', 'kiko.s@email.com', 'Phase 2, Block 19, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(93, 'Lito', 'N', 'Mercado', 'NA', 'male', '1988-06-06', 'married', '09170000073', 'lito.m@email.com', 'Phase 3, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(94, 'Mely', 'O', 'Mercado', 'NA', 'female', '1990-07-07', 'married', '09170000074', 'mely.m@email.com', 'Phase 3, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(95, 'Nico', 'O', 'Mercado', 'NA', 'male', '2018-08-08', 'single', NULL, NULL, 'Phase 3, Block 12, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(96, 'Omar', 'Q', 'Rivera', 'NA', 'male', '1982-09-09', 'married', '09170000075', 'omar.r@email.com', 'Phase 1, Block 4, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(97, 'Pia', 'R', 'Rivera', 'NA', 'female', '1984-10-10', 'married', '09170000076', 'pia.r@email.com', 'Phase 1, Block 4, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(98, 'Quin', 'R', 'Rivera', 'NA', 'male', '2015-11-11', 'single', NULL, NULL, 'Phase 1, Block 4, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(99, 'Rene', 'T', 'Quinto', 'NA', 'male', '1970-12-12', 'married', '09170000077', 'rene.q@email.com', 'Phase 4, Block 2, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(100, 'Sita', 'U', 'Quinto', 'NA', 'female', '1972-01-01', 'married', '09170000078', 'sita.q@email.com', 'Phase 4, Block 2, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(101, 'Toby', 'U', 'Quinto', 'NA', 'male', '2000-02-02', 'single', '09170000079', 'toby.q@email.com', 'Phase 4, Block 2, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(102, 'Xander', 'L', 'Ford', 'NA', 'male', '1995-03-03', 'single', '09170000080', 'xander@email.com', 'Phase 1, Block 30, NBBS', '2026-01-03 05:05:31', '2026-01-03 05:05:31'),
(103, 'Laurence Paul', 'Galvan', 'Quiniano', 'NA', 'male', '2000-05-27', 'single', '09946085013', 'quiniano.lp.bsinfotech@gmail.com', 'Brgy. NBBS Dagat-Dagatan', '2026-01-13 12:16:37', '2026-01-13 12:16:37'),
(104, 'Febrich Faith', NULL, 'Marin', 'NA', 'female', '2004-12-28', 'single', '09182223344', 'marin.f.bsinfotech@gmail.com', 'Blk 1 Lot 12 NBBS Dagat-Dagatan', '2026-01-18 04:45:27', '2026-01-18 04:45:27'),
(105, 'Pau', NULL, 'Quiniano', 'NA', 'male', '2000-05-27', 'single', '09685408094', 'quiniano.infotech@gmail.com', 'Brgy. NBBS Dagat-Dagatan', '2026-01-18 05:50:21', '2026-01-18 05:50:42'),
(106, 'Rency', NULL, 'Quiniano', 'NA', 'male', '2000-05-27', 'single', '09156128497', 'quiniano.lp@gmail.com', 'Brgy. NBBS Dagat-Dagatan', '2026-01-18 05:51:22', '2026-01-18 05:51:22'),
(107, 'Angela Tanya', 'Galera', 'Navarrosa', 'NA', 'female', '2003-11-01', 'single', '09942611480', 'navarrosa.at.bsinfotech@gmail.com', 'Brgy. NBBS Dagat-Dagatan', '2026-01-18 05:59:38', '2026-01-18 05:59:38');

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

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_name`, `location`, `date`, `time`, `status`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Linggo ng Kabataan 2026 Opening', 'NBBS Main Covered Court', '2026-08-12', '08:00:00', 'scheduled', 'Official kickoff of youth week featuring parade and talent showcase.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(2, 'Free Criminology Board Exam Review', 'Barangay Hall 2nd Floor', '2026-02-15', '09:00:00', 'scheduled', 'Free review sessions for graduating criminology students in the barangay.', '2026-01-03 05:13:06', '2026-01-03 05:14:30'),
(3, 'Inter-Color Basketball Tournament', 'Phase 1 Basketball Court', '2026-03-01', '16:00:00', 'scheduled', 'Annual summer sports league for residents aged 15-24.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(4, 'Mobile Library & Reading Hub', 'Phase 3 Multi-Purpose Hall', '2026-01-10', '10:00:00', 'scheduled', 'Providing access to textbooks and quiet study spaces for students.', '2026-01-03 05:13:06', '2026-01-03 05:14:03'),
(5, 'SK Job Fair 2026', 'Dagat-Dagatan People’s Plaza', '2026-05-20', '09:00:00', 'scheduled', 'Partnership with local businesses to provide employment for OSY and fresh grads.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(6, 'Digital Literacy Workshop', 'E-Library Hub, Phase 2', '2026-01-05', '13:00:00', 'completed', 'Basic computer operations and MS Office training for youth beneficiaries.', '2026-01-03 05:13:06', '2026-01-05 12:24:59'),
(7, 'Anti-Drug Awareness Seminar', 'NBBS Elementary School Gym', '2026-02-10', '14:00:00', 'scheduled', 'Mandatory BIDA program seminar for youth leaders and residents.', '2026-01-03 05:13:06', '2026-01-03 05:14:37'),
(8, 'Free Printing Service for Students', 'SK Office', '2026-01-05', '08:00:00', 'ongoing', 'Daily free printing and photocopying for school assignments and research.', '2026-01-03 05:13:06', '2026-01-05 02:52:08'),
(9, 'Mental Health Awareness Talk', 'Phase 4 Community Center', '2026-04-15', '15:00:00', 'scheduled', 'Expert-led discussion on managing stress and anxiety for teenagers.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(10, 'Youth Clean-up Drive', 'Phase 1 to Phase 4 Estero', '2026-01-20', '06:00:00', 'scheduled', 'Environmental initiative to clean local waterways and drainage systems.', '2026-01-03 05:13:06', '2026-01-03 05:15:09'),
(11, 'Basic First Aid Training', 'NBBS Health Center Frontage', '2026-03-12', '09:00:00', 'scheduled', 'Red Cross certified basic life support training for youth responders.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(12, 'Spoken Word Poetry Contest', 'SK Multi-Purpose Stage', '2026-02-14', '18:00:00', 'scheduled', 'Arts and culture event for local youth to express creativity.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(13, 'Voters Registration Assistance', 'Barangay Hall Lobby', '2026-06-05', '08:00:00', 'scheduled', 'Assisting first-time voters with forms and transport to COMELEC.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(14, 'Badminton Clinic for Kids', 'Phase 2 Covered Court', '2026-04-20', '07:00:00', 'scheduled', 'Basic skills training for children aged 8-12 years old.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(15, 'SK Scholarship General Assembly', 'NBBS Main Covered Court', '2026-01-15', '10:00:00', 'scheduled', 'Orientation for new and existing SK educational financial aid beneficiaries.', '2026-01-03 05:13:06', '2026-01-03 05:14:13'),
(16, 'Livelihood: Soap Making Demo', 'Phase 3 Block 10', '2026-03-25', '14:00:00', 'scheduled', 'Entrepreneurship workshop for Out-of-School Youth (OSY).', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(17, 'Feeding Program for Kids', 'Dagat-Dagatan Daycare Center', '2026-01-25', '11:00:00', 'scheduled', 'Nutritional support program for children in the community.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(18, 'Mobile Legends Tournament', 'SK Office (Online)', '2026-05-10', '13:00:00', 'scheduled', 'E-sports competition to promote teamwork and strategic thinking.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(19, 'Guitar and Ukulele Lessons', 'Phase 1 Gazebo', '2026-02-01', '16:00:00', 'scheduled', 'Weekly music classes for aspiring youth musicians.', '2026-01-03 05:13:06', '2026-01-03 05:14:42'),
(20, 'Zumba for Youth Fitness', 'NBBS Plaza', '2026-01-07', '06:00:00', 'completed', 'Morning fitness activity promoting healthy lifestyle.', '2026-01-03 05:13:06', '2026-01-07 12:32:35'),
(21, 'Distribution of School Supplies', 'Barangay Hall Grounds', '2026-06-15', '09:00:00', 'scheduled', 'Annual \"Back to School\" kit distribution for indigent students.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(22, 'Tree Planting Activity', 'NBBS Green Belt Area', '2026-07-01', '07:00:00', 'scheduled', 'Greening project to plant 100 seedlings in the barangay perimeter.', '2026-01-03 05:13:06', '2026-01-03 05:13:06'),
(23, 'Testing Email', 'Brgy. NBBS Dagat-Dagatan', '2026-01-18', '12:00:00', 'ongoing', 'Multi-account send emails testing.', '2026-01-18 05:52:45', '2026-01-18 05:52:45');

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

--
-- Dumping data for table `service_beneficiaries`
--

INSERT INTO `service_beneficiaries` (`id`, `service_id`, `resident_id`, `added_at`) VALUES
(1, 8, 3, '2026-01-03 05:29:07'),
(2, 8, 17, '2026-01-03 05:29:07'),
(3, 8, 80, '2026-01-03 05:29:07'),
(4, 8, 26, '2026-01-03 05:29:07'),
(5, 8, 35, '2026-01-03 05:29:07'),
(6, 8, 53, '2026-01-03 05:29:07'),
(7, 8, 92, '2026-01-03 05:29:07'),
(8, 8, 101, '2026-01-03 05:29:07'),
(9, 6, 53, '2026-01-03 05:32:05'),
(10, 6, 17, '2026-01-03 05:32:05'),
(11, 6, 26, '2026-01-03 05:32:05'),
(12, 6, 35, '2026-01-03 05:32:05'),
(13, 6, 80, '2026-01-03 05:32:05'),
(14, 6, 3, '2026-01-03 05:32:05'),
(15, 6, 7, '2026-01-03 05:32:05'),
(16, 6, 20, '2026-01-03 05:32:05'),
(17, 6, 4, '2026-01-03 05:32:05'),
(18, 6, 101, '2026-01-03 05:32:05'),
(19, 6, 92, '2026-01-03 05:32:05'),
(20, 6, 32, '2026-01-03 05:32:05'),
(21, 6, 59, '2026-01-03 05:32:05'),
(22, 6, 68, '2026-01-03 05:32:05'),
(23, 6, 77, '2026-01-03 05:32:05'),
(24, 6, 89, '2026-01-03 05:32:05'),
(25, 8, 103, '2026-01-13 12:19:31'),
(26, 8, 42, '2026-01-18 04:49:09'),
(27, 8, 43, '2026-01-18 04:49:09'),
(28, 23, 105, '2026-01-18 05:53:04'),
(29, 23, 103, '2026-01-18 05:53:05'),
(31, 23, 106, '2026-01-18 05:57:38'),
(32, 17, 107, '2026-01-18 05:59:53'),
(33, 17, 103, '2026-01-18 06:01:13');

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
(12, 2, '2025-12-31 11:41:50', '2025-12-31 17:51:52'),
(13, 2, '2025-12-31 18:14:30', '2025-12-31 18:17:50'),
(14, 1, '2026-01-01 13:50:53', '2026-01-01 14:12:36'),
(15, 1, '2026-01-01 14:13:18', '2026-01-01 14:49:51'),
(16, 1, '2026-01-02 02:31:00', '2026-01-02 05:52:43'),
(17, 2, '2026-01-02 02:34:22', '2026-01-02 03:33:23'),
(21, 1, '2026-01-02 05:53:34', '2026-01-03 12:19:00'),
(23, 6, '2026-01-03 04:33:30', '2026-01-03 04:33:34'),
(24, 6, '2026-01-03 04:34:49', '2026-01-03 04:37:24'),
(25, 1, '2026-01-05 02:51:39', '2026-01-05 02:58:51'),
(27, 1, '2026-01-05 06:50:23', '2026-01-05 12:22:45'),
(28, 1, '2026-01-05 12:23:53', '2026-01-05 13:32:56'),
(29, 6, '2026-01-05 12:43:48', '2026-01-05 13:28:12'),
(30, 1, '2026-01-07 12:30:26', '2026-01-07 12:39:38'),
(31, 1, '2026-01-08 03:50:14', '2026-01-08 03:52:05'),
(32, 1, '2026-01-13 12:15:10', '2026-01-13 12:24:47'),
(33, 1, '2026-01-18 04:43:21', '2026-01-18 04:52:23'),
(34, 1, '2026-01-18 04:54:32', NULL);

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
  `status` enum('active','deactivated') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `first_name`, `last_name`, `email`, `contact_number`, `profile_picture`, `position`, `status`, `created_at`, `updated_at`) VALUES
(1, '224-09160M', '$2b$10$wfhUE3QSNk0BjmeWg433M.qK2Dtd7w0qwV.V.lMLZ7ffkcA63TwTO', 'Laurence Paul', 'Quiniano', 'quiniano.lp.bsinfotech@gmail.com', '09946085013', '/uploads/profile/profile-1767077847655-249564712.png', 'admin', 'active', '2025-12-12 06:45:59', '2026-01-18 04:53:16'),
(2, '224-09159M', '$2b$10$Su3YPJ0P1lI.crNRszanEegNdr5ytPEdnROfE0JlNRw3146qXIOz2', 'Angela Tanya', 'Navarrosa', 'navarrosa.at.bsinfotech@gmail.com', '09942611480', NULL, 'staff', 'deactivated', '2025-12-12 06:59:37', '2026-01-18 06:20:23'),
(6, '224-09161M', '$2b$10$Fc.bJctkUNBSpq82XzG.Ae7oBzTB0PPqjh6Gh3kiOD7iF45fpfbIi', 'Laurence', 'Quiniano', 'quiniano.infotech@gmail.com', '09685408094', NULL, 'staff', 'active', '2026-01-03 04:31:07', '2026-01-03 04:50:47');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `households`
--
ALTER TABLE `households`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `household_members`
--
ALTER TABLE `household_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `service_beneficiaries`
--
ALTER TABLE `service_beneficiaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `time_log`
--
ALTER TABLE `time_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
