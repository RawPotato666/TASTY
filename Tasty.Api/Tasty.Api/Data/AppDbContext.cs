using Microsoft.EntityFrameworkCore;
using Tasty.Api.Models;

namespace Tasty.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Uporabnik> Uporabniki => Set<Uporabnik>();
        public DbSet<Vloga> Vloge => Set<Vloga>();
        public DbSet<UporabnikVloga> UporabnikVloge => Set<UporabnikVloga>();

        public DbSet<Recept> Recepti => Set<Recept>();
        public DbSet<KorakPriprave> KorakiPriprave => Set<KorakPriprave>();

        public DbSet<Sestavina> Sestavine => Set<Sestavina>();
        public DbSet<ReceptSestavina> ReceptSestavine => Set<ReceptSestavina>();

        public DbSet<Kategorija> Kategorije => Set<Kategorija>();
        public DbSet<ReceptKategorija> ReceptKategorije => Set<ReceptKategorija>();

        public DbSet<Oznaka> Oznake => Set<Oznaka>();
        public DbSet<ReceptOznaka> ReceptOznake => Set<ReceptOznaka>();

        public DbSet<PriljubljenRecept> PriljubljeniRecepti => Set<PriljubljenRecept>();
        public DbSet<KomentarRecept> KomentarjiReceptov => Set<KomentarRecept>();
        public DbSet<SlikaRecepta> SlikeReceptov => Set<SlikaRecepta>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReceptSestavina>()
                .HasKey(rs => new { rs.ReceptId, rs.SestavinaId });

            modelBuilder.Entity<ReceptKategorija>()
                .HasKey(rk => new { rk.ReceptId, rk.KategorijaId });

            modelBuilder.Entity<ReceptOznaka>()
                .HasKey(ro => new { ro.ReceptId, ro.OznakaId });

            modelBuilder.Entity<PriljubljenRecept>()
                .HasKey(pr => new { pr.UporabnikId, pr.ReceptId });

            modelBuilder.Entity<UporabnikVloga>()
                .HasKey(uv => new { uv.UporabnikId, uv.VlogaId });

            // Recept.Avtor – brez cascade na brisanje uporabnika
            modelBuilder.Entity<Recept>()
                .HasOne(r => r.Avtor)
                .WithMany(u => u.Recepti)
                .HasForeignKey(r => r.AvtorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Komentar.Recept – cascade
            modelBuilder.Entity<KomentarRecept>()
                .HasOne(k => k.Recept)
                .WithMany(r => r.Komentarji)
                .HasForeignKey(k => k.ReceptId)
                .OnDelete(DeleteBehavior.Cascade);

            // Komentar.Uporabnik – brez cascade (da ni multiple cascade path)
            modelBuilder.Entity<KomentarRecept>()
                .HasOne(k => k.Uporabnik)
                .WithMany(u => u.Komentarji)
                .HasForeignKey(k => k.UporabnikId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}
