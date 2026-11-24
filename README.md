# BioSonify Lab

The source package on this branch is stored in `BioSonify-Lab.zip.dpapi`. Windows Data Protection API (DPAPI) protects the package using the Windows user profile that encrypted it.

The account that encrypted the package can restore the ZIP locally with PowerShell 7.

```powershell
$encrypted = [IO.File]::ReadAllBytes((Resolve-Path -LiteralPath 'BioSonify-Lab.zip.dpapi').Path)
$archive = [Security.Cryptography.ProtectedData]::Unprotect(
    $encrypted, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
)
[IO.File]::WriteAllBytes([IO.Path]::GetFullPath('BioSonify-Lab-restored.zip'), $archive)
```

Keep subsequent source packages encrypted when replacing the archive on this branch. The ZIP includes the source, documentation, validation files, and license notices.
