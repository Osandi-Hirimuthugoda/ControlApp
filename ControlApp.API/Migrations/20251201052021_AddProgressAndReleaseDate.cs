using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControlApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProgressAndReleaseDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // --- ALREADY EXISTS IN DB: Commented out ---
            // migrationBuilder.AddColumn<string>(
            //     name: "Description",
            //     table: "Employees",
            //     type: "nvarchar(max)",
            //     nullable: true);

            // --- ALREADY EXISTS IN DB: Commented out ---
            // migrationBuilder.AddColumn<int>(
            //     name: "TypeId",
            //     table: "Employees",
            //     type: "int",
            //     nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StatusId",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ReleaseId",
                table: "Controls",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Controls",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "Controls",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            // --- THIS IS THE NEW PART YOU NEED ---
            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "Controls",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReleaseDate",
                table: "Controls",
                type: "datetime2",
                nullable: true);
            // -------------------------------------

            // --- ALREADY EXISTS IN DB: Commented out to fix error 1913 ---
            // migrationBuilder.CreateIndex(
            //     name: "IX_Employees_TypeId",
            //     table: "Employees",
            //     column: "TypeId");

            // migrationBuilder.AddForeignKey(
            //     name: "FK_Employees_ControlTypes_TypeId",
            //     table: "Employees",
            //     column: "TypeId",
            //     principalTable: "ControlTypes",
            //     principalColumn: "ControlTypeId",
            //     onDelete: ReferentialAction.SetNull);
            // -------------------------------------------------------------
        }

        /// <inheritdoc />
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

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Controls");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Controls");

            migrationBuilder.AlterColumn<int>(
                name: "StatusId",
                table: "Controls",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ReleaseId",
                table: "Controls",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Controls",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "Controls",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}