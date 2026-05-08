import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { execSync } from 'child_process';

interface BackupConfig {
  backupDir: string;
  retentionDays: number;
  compressionLevel: number;
  includeDatabase: boolean;
  includeFiles: boolean;
  includeConfig: boolean;
}

interface BackupMetadata {
  id: string;
  timestamp: Date;
  size: number;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  files: string[];
  checksum: string;
}

class BackupService {
  private config: BackupConfig;
  private backups: BackupMetadata[] = [];

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = {
      backupDir: config.backupDir || './backups',
      retentionDays: config.retentionDays || 30,
      compressionLevel: config.compressionLevel || 6,
      includeDatabase: config.includeDatabase !== false,
      includeFiles: config.includeFiles !== false,
      includeConfig: config.includeConfig !== false,
    };

    this.ensureBackupDir();
  }

  // Ensure backup directory exists
  private ensureBackupDir() {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true });
    }
  }

  // Create backup
  async createBackup(): Promise<BackupMetadata> {
    const startTime = Date.now();
    const backupId = 'backup-' + Date.now();
    const backupPath = path.join(this.config.backupDir, backupId);
    const files: string[] = [];

    try {
      fs.mkdirSync(backupPath, { recursive: true });

      // Backup database
      if (this.config.includeDatabase) {
        await this.backupDatabase(backupPath);
        files.push('database.sql.gz');
      }

      // Backup files
      if (this.config.includeFiles) {
        await this.backupFiles(backupPath);
        files.push('files.tar.gz');
      }

      // Backup configuration
      if (this.config.includeConfig) {
        await this.backupConfig(backupPath);
        files.push('config.json.gz');
      }

      // Create metadata
      const size = this.calculateDirSize(backupPath);
      const duration = Date.now() - startTime;
      const checksum = this.calculateChecksum(backupPath);

      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date(),
        size,
        duration,
        status: 'success',
        files,
        checksum,
      };

      this.backups.push(metadata);
      this.cleanOldBackups();

      console.log(`Backup created: ${backupId} (${size} bytes, ${duration}ms)`);
      return metadata;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  // Backup database
  private async backupDatabase(backupPath: string): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    const outputFile = path.join(backupPath, 'database.sql');
    const gzipFile = outputFile + '.gz';

    try {
      // Export database (MySQL example)
      execSync(`mysqldump --single-transaction --quick --lock-tables=false ${databaseUrl} > ${outputFile}`);

      // Compress
      const gzip = zlib.createGzip({ level: this.config.compressionLevel });
      const source = fs.createReadStream(outputFile);
      const destination = fs.createWriteStream(gzipFile);

      await new Promise((resolve, reject) => {
        source.pipe(gzip).pipe(destination).on('finish', resolve).on('error', reject);
      });

      // Remove uncompressed file
      fs.unlinkSync(outputFile);
    } catch (error) {
      console.error('Database backup failed:', error);
      throw error;
    }
  }

  // Backup files
  private async backupFiles(backupPath: string): Promise<void> {
    const outputFile = path.join(backupPath, 'files.tar.gz');

    try {
      // Create tar.gz of important directories
      execSync(`tar -czf ${outputFile} --exclude=node_modules --exclude=.git .`);
    } catch (error) {
      console.error('Files backup failed:', error);
      throw error;
    }
  }

  // Backup configuration
  private async backupConfig(backupPath: string): Promise<void> {
    const outputFile = path.join(backupPath, 'config.json');
    const gzipFile = outputFile + '.gz';

    try {
      const config = {
        timestamp: new Date(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        appVersion: process.env.APP_VERSION || 'unknown',
      };

      fs.writeFileSync(outputFile, JSON.stringify(config, null, 2));

      // Compress
      const gzip = zlib.createGzip({ level: this.config.compressionLevel });
      const source = fs.createReadStream(outputFile);
      const destination = fs.createWriteStream(gzipFile);

      await new Promise((resolve, reject) => {
        source.pipe(gzip).pipe(destination).on('finish', resolve).on('error', reject);
      });

      // Remove uncompressed file
      fs.unlinkSync(outputFile);
    } catch (error) {
      console.error('Config backup failed:', error);
      throw error;
    }
  }

  // Restore backup
  async restoreBackup(backupId: string): Promise<void> {
    const backup = this.backups.find(b => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const backupPath = path.join(this.config.backupDir, backupId);

    try {
      // Restore database
      if (backup.files.includes('database.sql.gz')) {
        await this.restoreDatabase(backupPath);
      }

      // Restore files
      if (backup.files.includes('files.tar.gz')) {
        await this.restoreFiles(backupPath);
      }

      console.log(`Backup restored: ${backupId}`);
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  // Restore database
  private async restoreDatabase(backupPath: string): Promise<void> {
    const gzipFile = path.join(backupPath, 'database.sql.gz');
    const sqlFile = path.join(backupPath, 'database.sql');

    try {
      // Decompress
      const gunzip = zlib.createGunzip();
      const source = fs.createReadStream(gzipFile);
      const destination = fs.createWriteStream(sqlFile);

      await new Promise((resolve, reject) => {
        source.pipe(gunzip).pipe(destination).on('finish', resolve).on('error', reject);
      });

      // Restore database
      const databaseUrl = process.env.DATABASE_URL;
      execSync(`mysql ${databaseUrl} < ${sqlFile}`);

      // Remove decompressed file
      fs.unlinkSync(sqlFile);
    } catch (error) {
      console.error('Database restore failed:', error);
      throw error;
    }
  }

  // Restore files
  private async restoreFiles(backupPath: string): Promise<void> {
    const tarFile = path.join(backupPath, 'files.tar.gz');

    try {
      execSync(`tar -xzf ${tarFile}`);
    } catch (error) {
      console.error('Files restore failed:', error);
      throw error;
    }
  }

  // List backups
  listBackups(): BackupMetadata[] {
    return this.backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Delete backup
  deleteBackup(backupId: string): void {
    const backup = this.backups.find(b => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const backupPath = path.join(this.config.backupDir, backupId);
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true });
    }

    this.backups = this.backups.filter(b => b.id !== backupId);
    console.log(`Backup deleted: ${backupId}`);
  }

  // Clean old backups
  private cleanOldBackups(): void {
    const now = Date.now();
    const maxAge = this.config.retentionDays * 24 * 60 * 60 * 1000;

    this.backups.forEach(backup => {
      if (now - backup.timestamp.getTime() > maxAge) {
        this.deleteBackup(backup.id);
      }
    });
  }

  // Calculate directory size
  private calculateDirSize(dir: string): number {
    let size = 0;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        size += this.calculateDirSize(filePath);
      } else {
        size += stat.size;
      }
    });

    return size;
  }

  // Calculate checksum
  private calculateChecksum(dir: string): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath);
      hash.update(content);
    });

    return hash.digest('hex');
  }

  // Get backup statistics
  getStatistics() {
    const totalSize = this.backups.reduce((sum, b) => sum + b.size, 0);
    const successCount = this.backups.filter(b => b.status === 'success').length;
    const failedCount = this.backups.filter(b => b.status === 'failed').length;

    return {
      totalBackups: this.backups.length,
      totalSize,
      successCount,
      failedCount,
      averageSize: this.backups.length > 0 ? totalSize / this.backups.length : 0,
      oldestBackup: this.backups.length > 0 ? this.backups[this.backups.length - 1].timestamp : null,
      newestBackup: this.backups.length > 0 ? this.backups[0].timestamp : null,
    };
  }
}

export const backupService = new BackupService();

// Schedule daily backups
export function scheduleBackups() {
  const now = new Date();
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 2, 0, 0); // 2 AM

  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    backupService.createBackup().catch(error => {
      console.error('Scheduled backup failed:', error);
    });

    // Repeat daily
    setInterval(() => {
      backupService.createBackup().catch(error => {
        console.error('Scheduled backup failed:', error);
      });
    }, 24 * 60 * 60 * 1000);
  }, delay);

  console.log(`Backup scheduled for ${scheduledTime.toISOString()}`);
}
