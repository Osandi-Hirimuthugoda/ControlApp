
-- 1. Delete Controls first (they reference other tables)
DELETE FROM Controls;

-- 2. Delete Employees (they can reference Users)
DELETE FROM Employees;

-- 3. Delete Users
DELETE FROM Users;

-- 4. Delete ControlTypes
DELETE FROM ControlTypes;

-- 5. Delete Releases
DELETE FROM Releases;

-- 6. Delete Statuses
DELETE FROM Statuses;

-- Reset identity columns (optional - resets auto-increment counters)
DBCC CHECKIDENT ('Controls', RESEED, 0);
DBCC CHECKIDENT ('Employees', RESEED, 0);
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('ControlTypes', RESEED, 0);
DBCC CHECKIDENT ('Releases', RESEED, 0);
DBCC CHECKIDENT ('Statuses', RESEED, 0);

PRINT 'All data deleted successfully!';
PRINT 'You can now register a new user and add employees from scratch.';








