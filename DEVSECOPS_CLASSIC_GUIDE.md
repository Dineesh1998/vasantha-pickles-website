# Azure DevOps Classic Pipeline Setup Guide for DevSecOps

This guide outlines the steps to create a **DevSecOps Build Pipeline** for your React application (`pickles-website`) using the **Classic Editor** (UI-based) in Azure DevOps.

## Prerequisites
1.  **Azure DevOps Project**: Ensure you have a project created.
2.  **Service Connections**:
    *   **SonarQube**: You need a running SonarQube instance and a service connection set up in Azure DevOps (Project Settings -> Service connections -> New service connection -> SonarQube).
    *   **Azure Subscription (ARM)**: For deployment steps later.
3.  **Extensions**: install **"SonarQube"** and **"OWASP Dependency Check"** extensions from the Visual Studio Marketplace if not already installed.

---

## Part 1: Create the Build Pipeline (CI & Security)

1.  Go to **Pipelines** -> **Pipelines** in the left menu.
2.  Click **New pipeline**.
3.  Click strict **"Use the classic editor"** (link at the bottom).
4.  **Select a source**:
    *   **Repository**: Choose `Azure Repos Git`.
    *   **Team project**: Your project.
    *   **Repository**: `vasantha-home-made-pickles`.
    *   **Branch**: `main` (or your default branch).
    *   Click **Continue**.
5.  **Select a template**:
    *   Search for **"Node.js with React"** or just choose **"Empty job"**.
    *   *Recommendation: Start with "Empty job".*

### Add Tasks to Agent Job 1

Click the **+** (plus) sign next to "Agent job 1" to add the following tasks in order:

#### 1. Node.js Tool Installer
*   **Search**: "Node.js tool installer"
*   **Version Spec**: `20.x` (or `18.x` depending on your preference)
*   **DisplayName**: "Install Node.js"

#### 2. SonarQube Prepare (SAST)
*   **Search**: "Prepare Analysis Configuration" (SonarQube)
*   **SonarQube Server Endpoint**: Select your created service connection.
*   **Scanner Mode**: `Use standalone scanner` (since it's a JS/React project).
*   **Scanner Mode > Manual Provisioning**:
    *   **Project Key**: `pickles-website` (Must match `sonar-project.properties`)
    *   **Project Name**: `pickles-website`
    *   **Sources**: `.` (root directory)
*   *Note: Since you have a `sonar-project.properties` file in your repo, you can also select "Use standalone scanner" and check "Mode > Manually provide configuration" might handle it differently, but usually selecting "CLI" or "Standalone" and pointing to the file path is best. Actually, if `sonar-project.properties` is in the root, simply selecting "Use standalone scanner" often auto-detects it during the analysis step, or you configure the key/name here manually as required by the task.*

#### 3. NPM Install
*   **Search**: "npm"
*   **Command**: `install`
*   **Working folder**: (Leave empty for root)
*   **DisplayName**: "npm install"

#### 4. NPM Audit (SCA - Software Composition Analysis)
*   **Search**: "Command Line" or "Bash"
*   **Script**: `npm audit --audit-level=high` (or just `npm audit` to see all)
*   **Fail on Standard Error**: Uncheck this (audit findings often go to stdout).
*   **Control Options**:
    *   *Continue on error*: Checked (so build doesn't fail hard immediately, unless you want it to).
    *   *DisplayName*: "Security Audit (Dependencies)"

#### 5. OWASP Dependency Check (Optional/Advanced SCA)
*   *(Only if extension installed)*
*   **Search**: "OWASP Dependency Check"
*   **Scan path**: `$(Build.SourcesDirectory)`
*   **Format**: `HTML` (for reports)

#### 6. Build
*   **Search**: "npm"
*   **Command**: `custom`
*   **Command and arguments**: `run build`
*   **DisplayName**: "npm run build"

#### 7. SonarQube Analyze
*   **Search**: "Run Code Analysis"
*   **DisplayName**: "Run SonarQube Analysis"
*   *(No configuration needed usually, it uses the Prepare step context)*

#### 8. SonarQube Publish
*   **Search**: "Publish Quality Gate Result"
*   **DisplayName**: "Publish SonarQube Results"

#### 9. Archive Files (Prepare Artifacts)
*   **Search**: "Archive files"
*   **Root folder or file to archive**: `dist` (This is where Vite builds to)
*   **Prepend root folder name to archive paths**: *Uncheck* (Important for static web apps)
*   **Archive type**: `zip`
*   **Archive file to create**: `$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip`

#### 10. Publish Build Artifacts
*   **Search**: "Publish build artifacts"
*   **Path to publish**: `$(Build.ArtifactStagingDirectory)`
*   **Artifact name**: `drop`
*   **Artifact publish location**: `Azure Pipelines`

### Triggers
1.  Go to the **Triggers** tab.
2.  Check **"Enable continuous integration"**.
3.  Branch filters: Include `main`.

### Save & Queue
1.  Click **Save & Queue** to run the pipeline.

---

## Part 2: Release Pipeline (Deployment) - Optional

Once the build artifact (`drop` zip) is created, create a Release Pipeline to deploy it.

1.  **Pipelines** -> **Releases** -> **New pipeline**.
2.  **Add an Artifact**: Select the Build Pipeline you just created.
3.  **Add a Stage**: "Empty job".
4.  **Tasks**:
    *   **Azure App Service Deploy** (if using App Service) OR **Azure Static Web App** task.
    *   *For App Service*:
        *   **Connection type**: Azure Resource Manager.
        *   **App Service type**: Web App on Linux (recommended for React).
        *   **Package or folder**: `$(System.DefaultWorkingDirectory)/**/*.zip`.
        *   **Runtime Stack**: Node 18 LTS/20 LTS.
        *   **Startup command**: `npx serve -s` (Using a simple server) OR configure the App Service to serve static files.

For a pure static site (Vite/React), **Azure Static Web Apps** is better, but typically requires a YAML pipeline commit. For Classic, deploying to **Azure Storage (Static Website)** is simpler:
*   Task: **Azure File Copy**
*   Source: `$(System.DefaultWorkingDirectory)/_YourProjectAlias/drop` (extracted).
*   Destination Type: Azure Blob.
*   Container Name: `$web`.

---

## 🛑 Is this "MNC Style" (Enterprise Grade)?

To answer your question directly: **Yes and No.**

### ✅ What IS Enterprise Standard:
The **flow** of steps provided above is the industry standard for DevSecOps:
1.  **CI (Continuous Integration)**: Build & Test on every commit.
2.  **SAST (SonarQube)**: Checking code quality and security vulnerabilities (e.g. Cross-Site Scripting) before merging.
3.  **SCA (NPM Audit)**: Checking for vulnerable dependencies (libraries).
4.  **Artifacts**: Producing a clean, versioned build artifact.

### ⚠️ What is NOT Enterprise Standard (and how to fix it):

**1. "Classic" (UI) vs. YAML (Code)**
*   **MNCs almost exclusively use YAML Pipelines ("Pipeline as Code")** now.
*   **Why?**
    *   **Versioning**: Pipeline changes are tracked in Git history (who changed the build logic and when?).
    *   **Review**: Changes to the pipeline require a Pull Request and approval, preventing a rogue developer from disabling security checks.
    *   **Disaster Recovery**: If the project is deleted, the pipeline definitions are safe in the repo.
*   *The "Classic" editor is considered legacy.*

**2. Missing "Strict" Gates**
*   **Quality Gates**: In an MNC, the build **MUST FAIL** if:
    *   SonarQube detects *any* Critical/Blocker issues.
    *   Code Coverage is below 80%.
    *   `npm audit` finds High severity vulnerabilities.
*   *How to implement*: In the "SonarQube Publish" task, enable "Fail on Quality Gate failure".

**3. Secret Scanning (Critical for DevSecOps)**
*   MNCs scan for hardcoded credentials (AWS Keys, Azure Secrets, Passwords) to prevent leaks.
*   *Add this*: Install the **Gitleaks** or **TruffleHog** extension and add it as the **very first step** of the pipeline.

**4. Branch Policies**
*   MNCs **lock** the `main` branch.
*   *Setup*: Go to **Repos -> Branches -> main -> Branch Policies**.
    *   Require a minimum number of reviewers (usually 2).
    *   **Check "Build Validation"**: Select your pipeline. This forces the DevSecOps pipeline to pass *before* anyone can merge code.

### Summary
If you want to work like an MNC, you should eventually **convert this logic to a YAML pipeline** and enable **Branch Policies** to enforce it. Classic is great for learning, but YAML is for professionals.
