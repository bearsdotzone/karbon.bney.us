import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Roman {
	public static void main(String[] args) throws FileNotFoundException {
		Scanner s = new Scanner(new File("roman.dat"));
		s.nextLine();
		while(s.hasNextLine()){
			String str = s.nextLine();
			System.out.print(str + " = ");
			str = str.replaceAll("IV", "!");
			str = str.replaceAll("IX", "@");
			str = str.replaceAll("IL", "#");
			str = str.replaceAll("IC", "$");
			str = str.replaceAll("ID", "%");
			str = str.replaceAll("IM", "^");
			str = str.replaceAll("VL", "&");
			str = str.replaceAll("VC", "*");
			str = str.replaceAll("VD", "(");
			str = str.replaceAll("VM", ")");
			str = str.replaceAll("XL", "-");
			str = str.replaceAll("XC", "=");
			str = str.replaceAll("XD", "+");
			str = str.replaceAll("XM", "<");
			str = str.replaceAll("LD", ">");
			str = str.replaceAll("LM", "?");
			str = str.replaceAll("CM", "~");
			int i = 0;
			for(char c : str.toCharArray()){
				switch(c){
				case 'I': i+=1; break;
				case 'V': i+=5; break;
				case 'X': i+=10; break;
				case 'L': i+=50; break;
				case 'C': i+=100; break;
				case 'D': i+=500; break;
				case 'M': i+=1000; break;
				case '!': i+=4; break;
				case '@': i+=9; break;
				case '#': i+=49; break;
				case '$': i+=99; break;
				case '%': i+=499; break;
				case '^': i+=999; break;
				case '&': i+=45; break;
				case '*': i+=95; break;
				case '(': i+=495; break;
				case ')': i+=995; break;
				case '-': i+=40; break;
				case '=': i+=90; break;
				case '+': i+=490; break;
				case '<': i+=990; break;
				case '>': i+=450; break;
				case '?': i+=950; break;
				case '~': i+=900; break;
				}
			}
			System.out.println(i);
		}
	}

}
