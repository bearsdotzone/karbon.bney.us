import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class ConnectFour {
	public static boolean hasWon = false;
	public static void main(String[] args) throws FileNotFoundException {
		// TODO Auto-generated method stub
		Scanner scn = new Scanner(new File("connectfour.dat"));
		
		scn.nextLine();
		while (scn.hasNextLine()) {
			hasWon = false;
			char[][] grid = new char[6][7];
			for (int a = 0; a < 6; a++) {
				String tmp = scn.nextLine();
				if (tmp.length() == 0) {
					break;
				}
				for (int b = 0; b < 7; b++)
					grid[a][b] = tmp.charAt(b);

			}
			if (grid[0][0] == 0) {
				break;
			}
			for (int x = 0; x < 6; x++) {
				for (int y = 0; y < 5; y++) {
					foo(x, y, grid[x][y], grid, 0, 0);
					foo(x, y, grid[x][y], grid, 1, 0);
					foo(x, y, grid[x][y], grid, 2, 0);
					foo(x, y, grid[x][y], grid, 3, 0);
					foo(x, y, grid[x][y], grid, 4, 0);
					foo(x, y, grid[x][y], grid, 5, 0);
					foo(x, y, grid[x][y], grid, 6, 0);
					foo(x, y, grid[x][y], grid, 7, 0);
				}
			}
			if(!hasWon){
				System.out.println("No win");
			}
		}
	}

	public static void printArray(char[][] grid) {
		for (char[] a : grid) {
			System.out.println("");
			for (char b : a) {
				System.out.print(b);
			}

		}
	}

	public static void foo(int x, int y, char color, char[][] grid, int dir, int count) {
		int deltaX = 0, deltaY = 0;
		if (!(color == '-')) {
			switch (dir) {
			case 0:
				deltaY = -1;
				break;
			case 1:
				deltaX = 1;
				deltaY = -1;
				break;
			case 2:
				deltaX = 1;
				break;
			case 3:
				deltaX = 1;
				deltaY = 1;
				break;
			case 4:
				deltaY = 1;
				break;
			case 5:
				deltaX = -1;
				deltaY = 1;
				break;
			case 6:
				deltaX = -1;
				break;
			case 7:
				deltaX = -1;
				deltaY = -1;
				break;
			}
			boolean meh = false;
			try{
				meh = (grid[x][y] == color) && (grid[x+deltaX][y+deltaY] == color) && (grid[x+deltaX*2][y+deltaY*2] == color) && (grid[x+deltaX*3][y+deltaY*3] == color);
			}
			catch(Exception e){
				
			}
			if(meh && !hasWon){
				switch (color) {
				case 'r':
					System.out.println("Red Wins");
					hasWon = true;
					break;
				case 'b':
					System.out.println("Blue Wins");
					hasWon = true;
					break;
				}
				
			}
				
		}
	}
}
