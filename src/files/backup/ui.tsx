import React, {FC} from 'react';
import {Text} from 'ink';

interface FileComponentType {
	name: string,
}

export const FileC: FC<FileComponentType> = ({name = ''}) => {
	
	return (
		<Text>
			Successfully downloaded: <Text color="green">{name}</Text>
		</Text>
	)
}