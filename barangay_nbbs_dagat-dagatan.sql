-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2025 at 07:49 AM
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
(4, '/uploads/personalisation/images/carousel-1766636197294-357738198.jpg', 1, '2025-12-25 04:16:37');

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
(1, '/uploads/logo/logo-1766635917696-604757120.png', NULL, 'SK Barangay Information System - Brgy. Dagat-Dagatan', '#FFC300', 'SK Barangay Information System 2025', '#FFC300', '#000000', '#ECECEC', '#FF1818', '#FF1818', '2025-12-25 06:21:19');

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
(1, '224-09160M', '$2b$10$VcqS5NenIhz1KYsZtqaOJe4hlwf/ifutdC7wU.aYxD2xlITHUrgcS', 'Laurence Paul', 'Quiniano', 'quiniano.lp.bsinfotech@gmail.com', '9946085013', NULL, 'admin', 'active', '2025-12-12 06:45:59', '2025-12-19 08:28:49'),
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
-- Indexes for table `personalisation`
--
ALTER TABLE `personalisation`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
