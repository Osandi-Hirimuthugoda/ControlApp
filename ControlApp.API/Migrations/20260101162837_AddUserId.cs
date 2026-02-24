using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if UserId column exists before adding it
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                              WHERE TABLE_NAME = 'Employees' AND COLUMN_NAME = 'UserId')
                BEGIN
                    ALTER TABLE [Employees] ADD [UserId] int NULL;
                END
            ");

            // Create Users table if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
                BEGIN
                    CREATE TABLE [Users] (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [Username] nvarchar(100) NOT NULL,
                        [Email] nvarchar(255) NOT NULL,
                        [PasswordHash] nvarchar(max) NOT NULL,
                        [FullName] nvarchar(100) NULL,
                        [Role] nvarchar(max) NOT NULL,
                        [CreatedAt] datetime2 NOT NULL,
                        [LastLoginAt] datetime2 NULL,
                        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
                    );
                END
            ");

            // Create index if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Employees_UserId')
                BEGIN
                    CREATE INDEX [IX_Employees_UserId] ON [Employees] ([UserId]);
                END
            ");

            // Create foreign key if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Employees_Users_UserId')
                BEGIN
                    ALTER TABLE [Employees] ADD CONSTRAINT [FK_Employees_Users_UserId] 
                    FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE SET NULL;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Users_UserId",
                table: "Employees");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Employees_UserId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Employees");
        }
    }
}