# Enable TCP/IP for SQL Server Express

## Why This is Needed

SQL Server is currently only accepting Named Pipes connections. The Node.js backend needs TCP/IP to be enabled to connect properly.

## Step-by-Step Instructions

### Method 1: SQL Server Configuration Manager (Recommended)

1. **Open SQL Server Configuration Manager**:
   - Press `Win + R`
   - Type: `SQLServerManager16.msc` (for SQL Server 2022)
   - Or search for "SQL Server Configuration Manager" in Start Menu
   - **If not found**, try: `C:\Windows\SysWOW64\SQLServerManager16.msc`

2. **Enable TCP/IP**:
   - Expand **SQL Server Network Configuration**
   - Click on **Protocols for SQLEXPRESS**
   - Right-click on **TCP/IP** → Select **Enable**
   - Click **OK** when prompted

3. **Configure TCP/IP Settings** (Important!):
   - Right-click **TCP/IP** → **Properties**
   - Go to **IP Addresses** tab
   - Scroll to **IPALL** section at the bottom
   - Set:
     - **TCP Dynamic Ports**: `1433` (or leave empty)
     - **TCP Port**: `1433`
   - Click **OK**

4. **Restart SQL Server**:
   - Expand **SQL Server Services**
   - Right-click **SQL Server (SQLEXPRESS)**
   - Click **Restart**
   - Wait for service to restart (takes 10-20 seconds)

5. **Verify**:
   - Service should show **Running** status
   - Green arrow icon next to the service name

### Method 2: PowerShell (Alternative)

Run PowerShell as Administrator:

```powershell
# Stop SQL Server
Stop-Service -Name MSSQL$SQLEXPRESS -Force

# Enable TCP/IP (requires SQL Server Configuration Manager WMI provider)
$smo = 'Microsoft.SqlServer.Management.Smo.'
$wmi = New-Object ($smo + 'Wmi.ManagedComputer')
$uri = "ManagedComputer[@Name='$env:COMPUTERNAME']/ServerInstance[@Name='SQLEXPRESS']/ServerProtocol[@Name='Tcp']"
$Tcp = $wmi.GetSmoObject($uri)
$Tcp.IsEnabled = $true
$Tcp.Alter()

# Start SQL Server
Start-Service -Name MSSQL$SQLEXPRESS

Write-Host "✅ TCP/IP enabled for SQL Server"
```

### Method 3: Using Windows Services

If you can't access Configuration Manager:

1. Press `Win + R`, type `services.msc`
2. Find **SQL Server (SQLEXPRESS)**
3. Right-click → **Restart**
4. Then manually enable TCP/IP using Registry Editor (advanced users only)

## After Enabling TCP/IP

### Test Connection

```bash
cd backend
npx ts-node src/scripts/test-db-connection.ts
```

You should see:
```
✅ Connected to SQL Server successfully
✅ Database connection test passed
✅ Found 222 tables in database
```

### Restart Backend Server

The backend will automatically detect the database and switch from mock data to real data:

```bash
npm run dev
```

Look for:
```
✅ Database connected successfully
🚀 RMH POS Backend Server Started
```

## Troubleshooting

### Can't Find SQL Server Configuration Manager

Try these paths:
- SQL Server 2022: `C:\Windows\SysWOW64\SQLServerManager16.msc`
- SQL Server 2019: `C:\Windows\SysWOW64\SQLServerManager15.msc`
- SQL Server 2017: `C:\Windows\SysWOW64\SQLServerManager14.msc`

### PowerShell Script Fails

- Run PowerShell as Administrator
- Ensure SQL Server WMI provider is installed
- Try Method 1 (Configuration Manager) instead

### Still Can't Connect

1. Check Windows Firewall:
   ```powershell
   New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
   ```

2. Verify SQL Server is running:
   ```powershell
   Get-Service -Name MSSQL$SQLEXPRESS
   ```

3. Check if port 1433 is listening:
   ```powershell
   netstat -an | findstr "1433"
   ```

## Alternative: Keep Using Mock Data

If you prefer to test the system first before connecting to the database:

- ✅ System is **fully functional** with mock data
- ✅ All features work perfectly
- ✅ 40+ products, 15+ customers, transactions
- ❌ Data resets when server restarts

Once you're ready to connect to the real database, follow the steps above!

## Need Help?

- Database is restored: ✅ (222 tables)
- SQL Server is running: ✅
- TCP/IP enabled: ⏳ (Needs to be done)

After enabling TCP/IP, everything will work automatically!

