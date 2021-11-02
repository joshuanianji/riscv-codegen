import { Code, Grid, Note } from '@geist-ui/react';
import Copy from '@geist-ui/react-icons/copy';


interface Props {
    name: string;
    args: number;
    savedRegisters: number;
    addComments: boolean;
    copya0: number;
    saveRA: boolean;
}

const CodeOutput: React.FC<Props> = ({ name, args, savedRegisters, addComments, copya0, saveRA }) => {
    const blockComment = createBlockComment(name, args, savedRegisters, copya0);
    // highlights the code on user click
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/selectAllChildren
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        window.getSelection()?.selectAllChildren(e.currentTarget);
    }

    return (
        <Grid.Container>
            <Grid xs={24}>
                <Note type='success' style={{ width: '100%' }}>
                    Click on the code to highlight it.
                </Note>
            </Grid>
            <Grid xs={24}>
                <Code
                    block
                    onClick={e => handleClick(e)}
                    style={{ cursor: 'pointer', width: '100%' }}>
                    {addComments ? blockComment : ''}
                    {name ? name : 'Function:\n'}
                    {stack(true, savedRegisters, saveRA) + '\n'}
                    {copya0 ? createCopya0(copya0) + '\n' : ''}
                    {'	# ---- MAIN FUNCTION BODY\n\n'}
                    {stack(false, savedRegisters, saveRA) + '\n'}
                    {'	ret'}
                </Code>
            </Grid>
        </Grid.Container>

    )
}

// generates code for pushing/pulling to/from the stack
const stack = (push: boolean, savedRegisters: number, saveRA: boolean) => {
    const instr = push ? 'sw' : 'lw';
    const comment = `	# ---- ${push ? 'Add elements to stack' : 'Restore elements from stack'}`

    // if we save RA, we have to save an extra register
    const actualRegisters = saveRA ? savedRegisters + 1 : savedRegisters;

    let res = comment + '\n';
    res += push ? `	addi	sp, sp, -${actualRegisters * 4}\n` : '';

    // save/restore ra (if needed)
    if (saveRA) {
        res += `	${instr}	ra, 0(sp)\n`;
    }

    // add register stuff
    const start = saveRA ? 1 : 0;
    for (let i = start; i < actualRegisters; i++) {
        res += `	${instr}	s${i}, ${4 * i}(sp)\n`;
    }

    res += push ? '' : `	addi	sp, sp, ${actualRegisters * 4}\n`;

    return res;
}

// Generates code for copying arguments (a regs) to saved regs (s regs)
const createCopya0 = (copya0: number) => {
    let res = `	# ---- Copying Arguments\n`;

    for (let i = 0; i < copya0; i++) {
        res += `	mv 	s${i}, a${i} 			# s${i} <- a${i}\n`
    }

    return res;
}

// Generates code for Block Comment
const createBlockComment = (name: string, args: number, savedRegisters: number, copya0: number) => {
    let argRegs;
    let registerUsage;

    // arguments
    if (args === 0) {
        argRegs = '# 	None'
    } else {
        argRegs = Array.from(Array(args).keys()).map(i => `# 	a${i}: `).join('\n')
    }

    // register usage
    if (savedRegisters === 0) {
        registerUsage = 0;
    } else {
        registerUsage = '# Register Usage:\n';
        registerUsage += Array.from(Array(savedRegisters).keys()).map(i => {
            const isArg: boolean = i < copya0; // if it's just a copied argument.
            const end = isArg ? `a${i} (More desc. needed)` : '';
            return `# 	s${i}: ${end}`
        }).join('\n')
    }

    return `# -----------------------------------------------------------------------------
# ${name ? name : 'Function'}:
#
# Args:
${argRegs}
#
# DESCRIPTION HERE
#
${registerUsage}
# -----------------------------------------------------------------------------
`
}

export default CodeOutput;