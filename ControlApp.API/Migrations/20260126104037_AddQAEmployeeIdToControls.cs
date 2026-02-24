using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddQAEmployeeIdToControls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if QAEmployeeId column exists before adding it
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                              WHERE TABLE_NAME = 'Controls' AND COLUMN_NAME = 'QAEmployeeId')
                BEGIN
                    ALTER TABLE [Controls] ADD [QAEmployeeId] int NULL;
                END
            ");

            // Create index if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Controls_QAEmployeeId')
                BEGIN
                    CREATE INDEX [IX_Controls_QAEmployeeId] ON [Controls] ([QAEmployeeId]);
                END
            ");

            // Create foreign key if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Controls_Employees_QAEmployeeId')
                BEGIN
                    ALTER TABLE [Controls] ADD CONSTRAINT [FK_Controls_Employees_QAEmployeeId] 
                    FOREIGN KEY ([QAEmployeeId]) REFERENCES [Employees] ([Id]) ON DELETE NO ACTION;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Controls_Employees_QAEmployeeId",
                table: "Controls");

            migrationBuilder.DropIndex(
                name: "IX_Controls_QAEmployeeId",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "QAEmployeeId",
                table: "Controls");
        }
    }
}
