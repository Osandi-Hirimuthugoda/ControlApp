using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomIdToControls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomId",
                table: "Controls",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomId",
                table: "Controls");
        }
    }
}
