import { Code, Grid, Note, useToasts } from '@geist-ui/react';
import Copy from '@geist-ui/react-icons/copy';
import { useNavPermissions } from '@lib/NavigatorPermissionsProvider';
import { useEffect, useState } from 'react';


interface Props {
    name: string;
    args: number;
    savedRegisters: number;
    addComments: boolean;
    copya0: number;
    saveRA: boolean;
}

const CodeOutput: React.FC<Props> = ({ name, args, savedRegisters, addComments, copya0, saveRA }) => {
    const { supported } = useNavPermissions();
    const [, setToasts] = useToasts();

    const blockComment = createBlockComment(name, args, savedRegisters, copya0);
    const codeStr = code(name, addComments, blockComment, savedRegisters, saveRA, copya0);

    // highlights the code on user click, and copies it
    // if no permissions, give error
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/selectAllChildren
    const handleClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        window.getSelection()?.selectAllChildren(e.currentTarget);

        if (supported) {
            try {
                await navigator.clipboard.writeText(codeStr);
                setToasts({
                    type: 'success',
                    text: 'Successfully copied to clipboard!',
                });
            } catch (e) {
                setToasts({
                    type: 'error',
                    text: 'Unexpected error! ' + e,
                });
            }
        }
    }

    return (
        <Grid.Container>
            <Grid xs={24}>
                <ClipboardNote />
            </Grid>
            <Grid xs={24}>
                <Code
                    block
                    onClick={e => handleClick(e)}
                    style={{ cursor: 'pointer', width: '100%' }}>
                    {codeStr}
                </Code>
            </Grid>
        </Grid.Container>

    )
}

const code = (
    name: string,
    addComments: boolean,
    blockComment: string,
    savedRegisters: number,
    saveRA: boolean,
    copya0: number
): string => (
    `${addComments ? blockComment : ''}
${name ? `${name}:` : 'Function:'}
${stack(true, savedRegisters, saveRA)}
${copya0 ? createCopya0(copya0) + '\n' : ''}
${'	# ---- MAIN FUNCTION BODY\n\n'}
${stack(false, savedRegisters, saveRA)}
${'	ret'}
`)

// Checks if the navigator.permissions API is supported
// if not, it displays that the user has to click to highlight text
// if it is, it displays that the user can copy the code
const ClipboardNote: React.FC = () => {
    const { supported } = useNavPermissions();

    return (
        <Note style={{ width: '100%' }} type='success'>
            {supported ? 'Click on the highlighted code to copy it' : 'Click on the code to highlight it'}
        </Note>
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
        registerUsage = '';
    } else {
        registerUsage = '\n# Register Usage:\n';
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
# ${registerUsage}
# -----------------------------------------------------------------------------`
}

export default CodeOutput;