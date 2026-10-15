using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LumiLearn.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTopics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Topics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Topics_ModuleId_DisplayOrder",
                table: "Topics",
                columns: new[] { "ModuleId", "DisplayOrder" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Topics_ModuleId_DisplayOrder",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Topics");
        }
    }
}
