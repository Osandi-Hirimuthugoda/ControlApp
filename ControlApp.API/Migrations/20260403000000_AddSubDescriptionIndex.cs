using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    public partial class AddSubDescriptionIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubDescriptionIndex",
                table: "TestCases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubDescriptionIndex",
                table: "Defects",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubDescriptionIndex",
                table: "TestCases");

            migrationBuilder.DropColumn(
                name: "SubDescriptionIndex",
                table: "Defects");
        }
    }
}
