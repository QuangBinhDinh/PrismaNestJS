-- @param {String} $1:searchTerm The search term to match against first name or last name
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
WHERE first_name LIKE CONCAT('%', ?, '%')
   OR last_name LIKE CONCAT('%', ?, '%')
ORDER BY id ASC
LIMIT 100
