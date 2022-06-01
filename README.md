# PyTorch AWS Scratch-Workflow Helper

Makes working with a "Scratch-Space" Workflow with VSCode easy


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
3. You may be thinking to yourself wow this is great but what about getting all my work off the compute machine. Fortunately Horrace has thought of this too and thats were the extension command `Run Backup` comes into play. This will compress your `/scratch/$USER/work/` directory into a tar ball and store it on fsx for later use. When running `Initialize Scratch Space` this takes this tar ball and decompress it on your new compute node.  Your tar ball is store din `~/$USER/bin/`
4. You have finished writing all your opinfos and want to free up your resources. Run `Clear Tmux` this will end the tmux session that is keeping your salloc alive and free up your resources.  If something does not work right you can always scancel your jobs to free up resources.
### Config
Take a look at the extension settings for changing the salloc resource requests and other potentially helpful config settings.

---
#### This is a work in progress and hopefully this will updated and improved.