-- Insertar datos en la tabla `groups`
INSERT INTO `groups` (`group_id`, `group_name`, `description`, `access_type`, `active`, `created_date`, `updated_date`)
VALUES
('db3c367099ee4238b565596543538316', 'Administrador', 'Se encargan de administrar la página de protocolos.', 'Ambos', 1, '2024-07-12', '2024-07-12');

-- Insertar datos en la tabla `stateemployees`
INSERT INTO `stateemployees` (`stateEmployee_id`, `state_name`, `active`, `created_date`, `updated_date`)
VALUES
('26d42f4b60804b91aa3269c3a4565b0a', 'ACTIVO', 1, '2024-07-12', '2024-07-12'),
('d438fd59ecf74556abe4e9cffc40006b', 'INACTIVO', 1, '2024-07-12', '2024-07-12');

-- Insertar datos en la tabla `employees`
INSERT INTO `employees` (`employee_id`, `name`, `last_name`, `email`, `password`, `document_type`, `document_num`, `phone`, `created_date`, `updated_date`, `group_id`)
VALUES
('9a4cfb4498ee488e99af2ef7e359989f', 'Martín', 'Pepi', 'martinpepi_99@hotmail.com', 'scrypt:32768:8:1$KMDNQLe6FbBuiXOy$632eb82a3b026c52627f82f7b7b187d2314040d9db328776124a577959b42559acc68e313b04f24ce4835654167a39f95552ca7d0bf44368ed35cf6aec7124fa', 'DNI', '42010292', '2616255034', '2024-07-12', '2024-07-12', 'db3c367099ee4238b565596543538316');

-- Insertar datos en la tabla `employeestates`
INSERT INTO `employeestates` (`employeeState_id`, `stateEmployee_id`, `employee_id`, `created_date`)
VALUES
('000aec532a784f75b45062162a15ada0', '26d42f4b60804b91aa3269c3a4565b0a', '9a4cfb4498ee488e99af2ef7e359989f','2024-07-12');