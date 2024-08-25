# Table Explanations

## Staff

Explanation:

id: A unique identifier for each staff member, automatically generated.
name: The name of the staff member.
email: The email address of the staff member, set as unique.
password: The password for the staff member's account.
job: The job title or role of the staff member.
pay: The salary or pay rate of the staff member, with two decimal places.
manager_id: A reference to the staff member's manager, allowing null values and setting to null if the referenced manager is deleted.
created_at: The timestamp of when the record was created, defaulting to the current time.
updated_at: The timestamp of the last update to the record, defaulting to the current time.
active_tables: The number of active tables the staff member is managing, defaulting to 0.

## Tables

Explanation:

id: A unique identifier for each table, automatically generated.
table_number: The number assigned to the table.
seat_count: The number of seats available at the table.
created_at: The timestamp of when the record was created, defaulting to the current time.
updated_at: The timestamp of the last update to the record, defaulting to the current time.
active_orders: The number of active orders for the table, defaulting to 0.
active_order_id: A reference to the currently active order at the table, allowing null values and setting to null if the referenced order is deleted. It assumes there is an orders table with a primary key of id.
order_history: A JSONB field to store the history of orders for the table, defaulting to an empty array.

## Orders

Explanation:

id: A unique identifier for each order, automatically generated.
employee_id: A reference to the employee (staff member) who created or is responsible for the order, allowing null values and setting to null if the referenced staff member is deleted.
customer_id: A reference to the customer who placed the order, allowing null values and setting to null if the referenced customer is deleted. It assumes there is a customers table with a primary key of id.
table_id: A reference to the table where the order was placed, allowing null values and setting to null if the referenced table is deleted.
order_id: A unique identifier for the order within the system.
items: A JSONB field to store the details of the items ordered.
created_at: The timestamp of when the record was created, defaulting to the current time.
updated_at: The timestamp of the last update to the record, defaulting to the current time.
total: The total amount for the order, with two decimal places.
completed: A boolean flag indicating whether the order is completed, defaulting to false.
completed_at: The timestamp of when the order was completed.
cancelled: A boolean flag indicating whether the order is cancelled, defaulting to false.
cancelled_at: The timestamp of when the order was cancelled.
cancelled_reason: A text field to store the reason for cancelling the order.

## Customers

Explanation:

id: A unique identifier for each customer, automatically generated.
name: The name of the customer.
email: The email address of the customer, set as unique.
phone: The phone number of the customer.
created_at: The timestamp of when the record was created, defaulting to the current time.
updated_at: The timestamp of the last update to the record, defaulting to the current time.

## Menu

Explanation:

id: A unique identifier for each menu item, automatically generated.
name: The name of the menu item.
price: The price of the menu item, with two decimal places.
created_at: The timestamp of when the record was created, defaulting to the current time.
updated_at: The timestamp of the last update to the record, defaulting to the current time.
