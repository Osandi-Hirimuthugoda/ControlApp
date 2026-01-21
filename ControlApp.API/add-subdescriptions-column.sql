-- Manual SQL script to add SubDescriptions column if migration didn't apply
-- Run this if the SubDescriptions column doesn't exist in the Controls table

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Controls' 
    AND COLUMN_NAME = 'SubDescriptions'
)
BEGIN
    ALTER TABLE Controls
    ADD SubDescriptions NVARCHAR(MAX) NULL;
    
    PRINT 'SubDescriptions column added successfully';
END
ELSE
BEGIN
    PRINT 'SubDescriptions column already exists';
END
