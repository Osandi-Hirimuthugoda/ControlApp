using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    
    
    public partial class AddEmployeeTypeAndDescription : Migration
    {
        

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeId",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_TypeId",
                table: "Employees",
                column: "TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_ControlTypes_TypeId",
                table: "Employees",
                column: "TypeId",
                principalTable: "ControlTypes",
                principalColumn: "ControlTypeId",
                onDelete: ReferentialAction.SetNull);
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_ControlTypes_TypeId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_TypeId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "Employees");
        }
    }
}





















