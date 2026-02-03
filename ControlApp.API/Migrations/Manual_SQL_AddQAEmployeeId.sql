-- Manual SQL script to add QAEmployeeId column to Controls table
-- Run this script in SQL Server Management Studio or your database tool

-- Step 1: Add the QAEmployeeId column
ALTER TABLE [Controls]
ADD [QAEmployeeId] INT NULL;

-- Step 2: Create index for better query performance
CREATE INDEX [IX_Controls_QAEmployeeId] ON [Controls] ([QAEmployeeId]);

-- Step 3: Add foreign key constraint (using NO ACTION to avoid cascade path issues)
ALTER TABLE [Controls]
ADD CONSTRAINT [FK_Controls_Employees_QAEmployeeId] 
FOREIGN KEY ([QAEmployeeId]) 
REFERENCES [Employees] ([Id]) 
ON DELETE NO ACTION;

-- Step 4: Update the migration history table to mark this migration as applied
-- Replace '20260126104037' with your actual migration timestamp if different
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20260126104037_AddQAEmployeeIdToControls', '8.0.0');
