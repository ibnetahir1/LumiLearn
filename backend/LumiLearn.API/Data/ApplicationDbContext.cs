using LumiLearn.API.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LumiLearn.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Course> Courses => Set<Course>();
        public DbSet<Enrollment> Enrollments => Set<Enrollment>();
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<Topic> Topics => Set<Topic>();
        public DbSet<Material> Materials => Set<Material>();
        public DbSet<MaterialProgress> MaterialProgress => Set<MaterialProgress>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Course>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(c => c.Subject)
                .IsRequired()
                .HasMaxLength(200);

                entity.Property(c => c.Description)
                    .HasMaxLength(2000);

                entity.Property(c => c.TeacherId)
                .IsRequired();

                entity.HasOne(c => c.Teacher)
                      .WithMany(u => u.CoursesTaught)
                      .HasForeignKey(c => c.TeacherId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(c => c.TeacherId);
            });

            builder.Entity<Enrollment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.StudentId)
                      .IsRequired();

                entity.Property(e => e.Status)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.HasOne(e => e.Course)
                      .WithMany(c => c.Enrollments)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.Enrollments)
                      .HasForeignKey(e => e.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => new { e.CourseId, e.StudentId })
                      .IsUnique();

                entity.HasIndex(e => e.StudentId);
            });

            builder.Entity<Module>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.Description)
                      .IsRequired()
                      .HasMaxLength(2000);

                entity.Property(e => e.DisplayOrder)
                      .IsRequired();

                entity.Property(e => e.CourseId)
                      .IsRequired();

                entity.HasOne(e => e.Course)
                      .WithMany(e => e.Modules)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.CourseId, e.DisplayOrder })
                      .IsUnique();
            });

            builder.Entity<Topic>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.DisplayOrder)
                      .IsRequired();

                entity.HasOne(t => t.Module)
                      .WithMany(m => m.Topics)
                      .HasForeignKey(t => t.ModuleId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(t => t.ModuleId);

                entity.HasIndex(e => new { e.ModuleId, e.DisplayOrder })
                      .IsUnique();
            });

            builder.Entity<Material>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Type)
                      .IsRequired();

                entity.Property(m => m.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(m => m.Description)
                      .HasMaxLength(2000);

                entity.Property(m => m.StorageUrl)
                      .HasMaxLength(500);

                entity.Property(m => m.FileName)
                      .HasMaxLength(255);

                entity.Property(m => m.CreatedAt)
                      .IsRequired();

                entity.Property(m => m.DisplayOrder)
                      .IsRequired();

                entity.HasOne(m => m.Topic)
                      .WithMany(t => t.Materials)
                      .HasForeignKey(m => m.TopicId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(m => new
                {
                    m.TopicId,
                    m.DisplayOrder
                });
            });

            builder.Entity<MaterialProgress>(entity =>
            {
                entity.HasKey(mp => mp.Id);

                entity.Property(mp => mp.StudentId)
                      .IsRequired();

                entity.Property(mp => mp.Status)
                      .IsRequired();

                entity.HasOne(mp => mp.Material)
                      .WithMany(m => m.ProgressRecords)
                      .HasForeignKey(mp => mp.MaterialId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(mp => mp.Student)
                      .WithMany()
                      .HasForeignKey(mp => mp.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                // One progress record per student per material.
                entity.HasIndex(mp => new
                {
                    mp.MaterialId,
                    mp.StudentId
                })
                .IsUnique();
            });
        }
    }
}
