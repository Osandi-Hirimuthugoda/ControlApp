using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentToDefects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Columns AttachmentUrl and Category already exist in database
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "AttachmentUrl", table: "Defects");
            migrationBuilder.DropColumn(name: "Category", table: "Defects");
        }
    }
}
