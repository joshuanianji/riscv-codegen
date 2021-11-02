import { Code, Fieldset } from '@geist-ui/react';
import Copy from '@geist-ui/react-icons/copy';


interface Props {
    name: string;
    args: number;
    savedRegisters: number;
    addComments: boolean;
    copya0: number;
}

const CodeOutput: React.FC<Props> = ({ name, args, savedRegisters, addComments, copya0 }) => {
    const blockComment = createBlockComment(name, args, savedRegisters, copya0);
    // highlights the code on user click
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/selectAllChildren
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        window.getSelection()?.selectAllChildren(e.currentTarget);
    }

    return (
        <Code
            block
            onClick={e => handleClick(e)}
            style={{ cursor: 'pointer' }}>
            {addComments ? blockComment : ''}
            {name ? name : 'Function:\n'}
            {stack(true, savedRegisters) + '\n'}
            {copya0 ? createCopya0(copya0) + '\n' : ''}
            {'	# ---- MAIN FUNCTION BODY\n\n'}
            {stack(false, savedRegisters) + '\n'}
            {'	ret'}
        </Code>

    )
}

// generates code for pushing/pulling to/from the stack
const stack = (push: boolean, savedRegisters: number) => {
    const instr = push ? 'sw' : 'lw';
    const comment = `	# ---- ${push ? 'Add elements to stack' : 'Restore elements from stack'}`

    let res = comment + '\n';
    res += push ? `	addi	sp, sp, -${savedRegisters * 4}\n` : '';

    // add register stuff
    for (let i = 0; i < savedRegisters; i++) {
        res += `	${instr}	s${i}, ${4 * i}(sp)\n`;
    }

    res += push ? '' : `	addi	sp, sp, ${savedRegisters * 4}\n`;

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