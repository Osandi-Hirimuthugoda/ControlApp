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
            migrationBuilder.AddColumn<int>(
                name: "QAEmployeeId",
                table: "Controls",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Controls_QAEmployeeId",
                table: "Controls",
                column: "QAEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Controls_Employees_QAEmployeeId",
                table: "Controls",
                column: "QAEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
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
