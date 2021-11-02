import { Code } from '@geist-ui/react';

interface Props {
    name: string;
    args: number;
    savedRegisters: number;
    addComments: boolean;
    copya0: number;
}

const CodeOutput: React.FC<Props> = ({ name, args, savedRegisters, addComments, copya0 }) => {
    const blockComment = createBlockComment(name, args, savedRegisters);

    return (
        <Code block>
            {addComments ? blockComment : ''}
            {name ? name : 'Function:\n'}
            {stack(true, savedRegisters) + '\n'}
            {'	# MAIN FUNCTION BODY\n\n'}
            {stack(false, savedRegisters) + '\n'}
            {'	ret'}
        </Code>
    )
}

// generates code for pushing/pulling to/from the stack
const stack = (push: boolean, savedRegisters: number) => {
    const instr = push ? 'sw' : 'lw';
    const comment = `	# ---- ${push ? 'Add elements to Stack' : 'Restore elements from Stack'}`

    let res = comment + '\n';
    res += push ? `	addi	sp, sp, -${savedRegisters * 4}\n` : '';

    // add register stuff
    for (let i = 0; i < savedRegisters; i++) {
        res += `	${instr}	s${i}, ${4 * i}(sp)\n`;
    }

    res += push ? '' : `	addi	sp, sp, ${savedRegisters * 4}\n`;

    return res;
}

const createBlockComment = (name: string, args: number, savedRegisters: number) => {
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
        registerUsage += Array.from(Array(savedRegisters).keys()).map(i => `# 	s${i}: `).join('\n')
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