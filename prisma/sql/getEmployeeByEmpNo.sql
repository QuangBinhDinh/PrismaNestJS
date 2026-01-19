-- @param {Int} $1:empNo The employee number to search for
SELECT
  id,
  emp_no AS empNo,
  birth_date AS birthDate,
  first_name AS firstName,
  last_name AS lastName,
  gender,
  hire_date AS hireDate,
  created_at AS createdAt,
  updated_at AS updatedAt
FROM employees
WHERE emp_no = ?
LIMIT 1
