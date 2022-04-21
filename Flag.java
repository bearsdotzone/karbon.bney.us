import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;


public class Flag {

	public static void main(String[] args) throws FileNotFoundException {
		// TODO Auto-generated method stub
		Scanner s = new Scanner(new File("flag.dat"));
		s.nextLine();
		while(s.hasNextLine()){
			String str = s.nextLine();
			if(str == "")
				break;
			String[] sNums = str.split(" ");
			int[] nums = new int[2];
			nums[0] = Integer.parseInt(sNums[0]);
			nums[1] = Integer.parseInt(sNums[1]);
			nums[0] /= 3;
			for(int i = 0; i < nums[1]; i++){
				if(i == 0 || i == nums[1]-1){
					for(int j = 0; j < nums[0]; j++){
						System.out.print('G');
					}
					for(int j = 0; j < nums[0]; j++){
						System.out.print('-');
					}
					for(int j = 0; j < nums[0]; j++){
						System.out.print('R');
					}
					System.out.println();
				}
				else{
					for(int j = 0; j < nums[0]; j++){
						System.out.print('G');
					}
					for(int j = 0; j < nums[0]; j++){
						System.out.print(' ');
					}
					for(int j = 0; j < nums[0]; j++){
						System.out.print('R');
					}
					System.out.println();
				}
			}
			System.out.println();
		}
	}

}
