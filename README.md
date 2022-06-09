# PyTorch AWS Scratch-Workflow Helper

Makes working with a "Scratch-Space" Workflow with VSCode easy

## Installation
Simply install this extension like you would any other VSCode extension. Go to the extension tab of VSCode, search up "PyTorch AWS", and install the extension. Also check out the extension [here](https://marketplace.visualstudio.com/items?itemName=chillee.pytorch-aws-scratch-helper).

## Workflow
The typical workflow for working with the AI Platform AWS GPU Cluster can be
found [here](https://www.internalfb.com/intern/wiki/PyTorch/PyTorchDev/Workflow/PyTorch_environment_setup/pytorch_aws_setup/). This webpage explains the steps needed to
setup your environment. The problem with this is that pytorch is installed to the distributed
file system at /fsx. Unfortunately building pytorch from source takes a long time when pytorch is mounted here. This is an alternative workflow which for now is a good work around the limitations of the distributed file system.

There are two main features of this extension.
1. Make it easy to allocate resources on the slurm cluster compute nodes.
2. Provide helper scripts for an alternative workflow in which relevant files are placed into /scratch space on compute nodes.

## Setup
There are a steps need in order to get this extension to work as expected.

1. Follow the steps listed [here](https://www.internalfb.com/intern/wiki/PyTorch/PyTorchDev/Workflow/PyTorch_environment_setup/pytorch_aws_setup/), specifically the "SIGNUP" and "USE THE CLUSTER" steps. These steps will have created an ssh config file on your local machine to ` ~/.ssh/ai_ssh/$USER/config`. You should also have conda setup for your user on the login node.
2. In your base conda enviornment install lz4 `conda install lz4`
3. In order to ssh directly into a compute node a new entry needs to be added to the above config file. The entry can be found [here](https://fb.quip.com/u1KuAWQGd5CB).
4. This is all that needs to be done in order to be able to run: `PyTorch AWS: Allocate Compile Node`. A sample workflow would be sshing into the login node and running `sinfo` which will show you the current utilization of the compute nodes. Once you know a low utilized compute node. You can use this node number in the above extension command. A side effect is that this number is written to a txt file in `~/.ssh/ai_ssh/$USER/number.txt` which is used in the ssh config.

### Working on /scratch

*NOTE*
If this is your first time using this workflow then the initializing of the workspace will fail when it tries to copy a tarball into `scratch/$USER/work`. This is your new home. You will love and cherish your new home. Everything needed for speed should be downloaded here. There exists an extension command `PyTorch AWS: Create Workspace` that will create this workspace and create the initial backup for you. The location of this workspace defaults to: `/scratch/$USER/work`. A conda env will created at `/scratch/$USER/env` as well. The required dependencies for building from source will be installed. The names of this directory and the conda env can be configured in this extensions settings.

1. Run the extension command: `Initialize Scratch Space`. This runs a script that will create a new directory on the compute node in `scratch/$USER/` and will copy over your tarball of all your previous `work` to this directory and extract it using Lz4.
2. You can then mount this directory to vscode and anything you would like to do from this new fast space. Create a conda env in this directory: `conda create -p {your conda env name}`.
3. You may be thinking to yourself wow this is great but what about getting all my work off the compute machine. Fortunately Horace has thought of this too and that's where the extension command `Run Backup` comes into play. This will compress your `/scratch/$USER/work/` directory into a tar ball and store it on fsx for later use. When running `Initialize Scratch Space` this takes this tar ball and decompress it on your new compute node.  Your tar ball is stored in `~/$USER/bin/`
4. You have finished writing all your opinfos and want to free up your resources. Run `Clear Tmux` this will end the tmux session that is keeping your salloc alive and free up your resources.  If something does not work right you can always scancel your jobs to free up resources.

### Tips:
1. **Important**: Use a local ccache instead of the shared ccache (`export CCACHE_DIR='/tmp/ccache'`). As the shared ccache is on a network drive, enabling it slows my build by more than 2x (compared to not having a ccache at all!)
1. If you use the same compute node, you won't need to run "initialize scratch space" again - as `/scratch` is usually persistent across multiple days.
2. You'll need to run this extension's commands from a different VSCode session than the one connected through SSH. For some of the commands this is fundamental - you can't have a VSCode instance SSH'ed into the compute node if you haven't run `Allocate Compute Node` yet. For some of the others it's due to stupid reasons.
3. As the SSH entry should automatically update what it's pointed to when this extension allocate another compute node, you should never need to add a new SSH entry to your VSCode instance. Just always connect to `compile_machine` and work on `/scratch/work/$USER/work`. Even if the underlying machine changes, the only thing that should change is what number you enter for `Allocate Compute Node`.
4. This extension is largely a wrapper around a couple of shell scripts. If you prefer to run the shell scripts yourself, go ahead :)
5. Another nifty command is `Auto Backup`, which automatically runs `Backup` every 30 minutes.


### Config
Take a look at the extension settings for changing the salloc resource requests and other potentially helpful config settings.

---
#### This is a work in progress and hopefully will be updated and improved.
