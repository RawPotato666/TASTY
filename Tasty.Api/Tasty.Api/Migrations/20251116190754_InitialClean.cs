using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tasty.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialClean : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Oznake",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oznake", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sestavine",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sestavine", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Uporabniki",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GesloHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumRegistracije = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uporabniki", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vloge",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vloge", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recepti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naslov = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CasPripraveMin = table.Column<int>(type: "int", nullable: false),
                    SteviloPorcij = table.Column<int>(type: "int", nullable: false),
                    JeJaven = table.Column<bool>(type: "bit", nullable: false),
                    DatumUstvarjanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AvtorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recepti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recepti_Uporabniki_AvtorId",
                        column: x => x.AvtorId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UporabnikVloge",
                columns: table => new
                {
                    UporabnikId = table.Column<int>(type: "int", nullable: false),
                    VlogaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UporabnikVloge", x => new { x.UporabnikId, x.VlogaId });
                    table.ForeignKey(
                        name: "FK_UporabnikVloge_Uporabniki_UporabnikId",
                        column: x => x.UporabnikId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UporabnikVloge_Vloge_VlogaId",
                        column: x => x.VlogaId,
                        principalTable: "Vloge",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KomentarjiReceptov",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    UporabnikId = table.Column<int>(type: "int", nullable: false),
                    Besedilo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ocena = table.Column<int>(type: "int", nullable: true),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KomentarjiReceptov", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KomentarjiReceptov_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KomentarjiReceptov_Uporabniki_UporabnikId",
                        column: x => x.UporabnikId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KorakiPriprave",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    ZaporednaStevilka = table.Column<int>(type: "int", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CasTrajanjaMin = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorakiPriprave", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KorakiPriprave_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PriljubljeniRecepti",
                columns: table => new
                {
                    UporabnikId = table.Column<int>(type: "int", nullable: false),
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    DatumDodano = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PriljubljeniRecepti", x => new { x.UporabnikId, x.ReceptId });
                    table.ForeignKey(
                        name: "FK_PriljubljeniRecepti_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PriljubljeniRecepti_Uporabniki_UporabnikId",
                        column: x => x.UporabnikId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReceptKategorije",
                columns: table => new
                {
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    KategorijaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceptKategorije", x => new { x.ReceptId, x.KategorijaId });
                    table.ForeignKey(
                        name: "FK_ReceptKategorije_Kategorije_KategorijaId",
                        column: x => x.KategorijaId,
                        principalTable: "Kategorije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReceptKategorije_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReceptOznake",
                columns: table => new
                {
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    OznakaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceptOznake", x => new { x.ReceptId, x.OznakaId });
                    table.ForeignKey(
                        name: "FK_ReceptOznake_Oznake_OznakaId",
                        column: x => x.OznakaId,
                        principalTable: "Oznake",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReceptOznake_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReceptSestavine",
                columns: table => new
                {
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    SestavinaId = table.Column<int>(type: "int", nullable: false),
                    Kolicina = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opomba = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceptSestavine", x => new { x.ReceptId, x.SestavinaId });
                    table.ForeignKey(
                        name: "FK_ReceptSestavine_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReceptSestavine_Sestavine_SestavinaId",
                        column: x => x.SestavinaId,
                        principalTable: "Sestavine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SlikeReceptov",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceptId = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JeNaslovna = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlikeReceptov", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlikeReceptov_Recepti_ReceptId",
                        column: x => x.ReceptId,
                        principalTable: "Recepti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KomentarjiReceptov_ReceptId",
                table: "KomentarjiReceptov",
                column: "ReceptId");

            migrationBuilder.CreateIndex(
                name: "IX_KomentarjiReceptov_UporabnikId",
                table: "KomentarjiReceptov",
                column: "UporabnikId");

            migrationBuilder.CreateIndex(
                name: "IX_KorakiPriprave_ReceptId",
                table: "KorakiPriprave",
                column: "ReceptId");

            migrationBuilder.CreateIndex(
                name: "IX_PriljubljeniRecepti_ReceptId",
                table: "PriljubljeniRecepti",
                column: "ReceptId");

            migrationBuilder.CreateIndex(
                name: "IX_Recepti_AvtorId",
                table: "Recepti",
                column: "AvtorId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceptKategorije_KategorijaId",
                table: "ReceptKategorije",
                column: "KategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceptOznake_OznakaId",
                table: "ReceptOznake",
                column: "OznakaId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceptSestavine_SestavinaId",
                table: "ReceptSestavine",
                column: "SestavinaId");

            migrationBuilder.CreateIndex(
                name: "IX_SlikeReceptov_ReceptId",
                table: "SlikeReceptov",
                column: "ReceptId");

            migrationBuilder.CreateIndex(
                name: "IX_UporabnikVloge_VlogaId",
                table: "UporabnikVloge",
                column: "VlogaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KomentarjiReceptov");

            migrationBuilder.DropTable(
                name: "KorakiPriprave");

            migrationBuilder.DropTable(
                name: "PriljubljeniRecepti");

            migrationBuilder.DropTable(
                name: "ReceptKategorije");

            migrationBuilder.DropTable(
                name: "ReceptOznake");

            migrationBuilder.DropTable(
                name: "ReceptSestavine");

            migrationBuilder.DropTable(
                name: "SlikeReceptov");

            migrationBuilder.DropTable(
                name: "UporabnikVloge");

            migrationBuilder.DropTable(
                name: "Kategorije");

            migrationBuilder.DropTable(
                name: "Oznake");

            migrationBuilder.DropTable(
                name: "Sestavine");

            migrationBuilder.DropTable(
                name: "Recepti");

            migrationBuilder.DropTable(
                name: "Vloge");

            migrationBuilder.DropTable(
                name: "Uporabniki");
        }
    }
}
